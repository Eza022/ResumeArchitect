import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import mammoth from "mammoth";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.use(express.json());

// Set up rate limiting to prevent API abuse and quota exhaustion
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", apiLimiter);

// Protect server RAM and Vercel payload limits by setting a hard 4MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
});

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey || geminiApiKey === "MY_GEMINI_API_KEY") {
  console.warn("Missing or invalid GEMINI_API_KEY in environment variables.");
}

const ai = new GoogleGenAI({
  apiKey: geminiApiKey || "MISSING",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Retry a Gemini API call up to `maxAttempts` times with exponential backoff
 * when the service returns a 503 "high demand" error.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const is503 =
        err?.status === 503 ||
        err?.message?.includes("503") ||
        err?.message?.toLowerCase().includes("high demand") ||
        err?.message?.toLowerCase().includes("unavailable");

      if (is503 && attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1); // 1s, 2s, 4s…
        console.warn(`Gemini 503 on attempt ${attempt}/${maxAttempts}. Retrying in ${delay}ms…`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        lastError = err;
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

app.post("/api/extract-text", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let text = "";
    const fileType = req.file.mimetype;
    const fileName = req.file.originalname;

    console.log(`Processing file: ${fileName} (${fileType})`);

    if (fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
      // Use Gemini's native PDF understanding — no local worker needed (works on Vercel)
      try {
        console.log("Extracting PDF text via Gemini...");
        const response = await withRetry(() =>
          ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: req.file!.buffer.toString("base64")
                  }
                },
                {
                  text: "Extract all text from this resume PDF faithfully. Maintain a logical order. Output ONLY the extracted text content, no commentary."
                }
              ]
            }
          })
        );
        text = response.text || "";
        console.log(`Gemini PDF extraction succeeded. Extracted ${text?.length || 0} characters.`);
      } catch (pdfErr: any) {
        console.error("Gemini PDF Extraction Error:", pdfErr);
        const is503 =
          pdfErr?.status === 503 ||
          pdfErr?.message?.includes("503") ||
          pdfErr?.message?.toLowerCase().includes("high demand") ||
          pdfErr?.message?.toLowerCase().includes("unavailable");
        if (is503) {
          throw new Error("The AI extraction service is busy after 3 attempts. Please try again in a few moments or paste your CV manually.");
        }
        throw new Error(`Failed to extract text from PDF: ${pdfErr.message || pdfErr}`);
      }
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword" ||
      fileName.endsWith(".docx") || 
      fileName.endsWith(".doc")
    ) {
      try {
        const data = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = data.value;
      } catch (docErr) {
        console.error("Word Parse Error:", docErr);
        throw new Error("Could not parse Word document.");
      }
    } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      text = req.file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ error: `Unsupported file type: ${fileType}. Please upload PDF, DOCX, or TXT.` });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "The file appears to be empty or contains no extractable text." });
    }

    console.log(`Successfully extracted ${text.length} characters.`);
    res.json({ text });
  } catch (error: any) {
    console.error("Extraction Error:", error);
    res.status(500).json({ error: error.message || "Failed to extract text from file" });
  }
});

app.post("/api/tailor-resume", async (req, res) => {
  try {
    const { currentResume, jobDescription } = req.body;

    if (!currentResume || !jobDescription) {
      return res.status(400).json({ error: "Missing resume or job description" });
    }

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        You are an expert resume writer and career coach. 
        I will provide a user's current resume and a job description. 
        Your task is to:
        1. Refactor and tailor the resume to perfectly fit the target job description, structuring it into the required JSON schema.
        2. Write a professional cover letter tailored to the job description.
        3. Provide a match analysis score (0-100) and identify keywords.

        Guidelines for Resume:
        - Extract personal details (name, email, phone, location) from the current resume. If not found, use placeholder or standard details. Include LinkedIn, GitHub, or portfolio links if they are in the current resume.
        - Refactor the professional summary to highlight the candidate's core value proposition for this target role.
        - Refactor work experience. Rewrite experience bullet points to emphasize skills, technologies, and achievements relevant to the job description. Quantify achievements using the STAR method (e.g., "Increased performance by 25% by implementing X").
        - Extract and category skills (e.g., Languages, Frameworks, Developer Tools, Design, Soft Skills). Ensure skills required by the job description are included if they align with the candidate's experience.
        - DO NOT hallucinate or invent projects. Extract ALL projects from the current resume without omitting any. If the original resume has no projects, return an empty array for projects.
        - DO NOT hallucinate languages or certifications. Extract certifications and languages ONLY if present in the current resume. If not, omit these fields or return empty arrays.
        - Extract ALL references from the current resume. For each reference include their full name, job title, company/organisation, and contact details (email and/or phone) if provided. If a reference says "Available on request", include that as a single reference entry with name set to "Available on request" and other fields empty.
        - The returned JSON must match the required schema exactly.

        Guidelines for Cover Letter:
        - Address the specific needs and pain points mentioned in the job description.
        - Maintain a professional, confident, and compelling tone.

        CURRENT RESUME:
        ${currentResume}

        JOB DESCRIPTION:
        ${jobDescription}
      `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tailoredResume: {
                type: Type.OBJECT,
                properties: {
                  contact: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      title: { type: Type.STRING },
                      email: { type: Type.STRING },
                      phone: { type: Type.STRING },
                      location: { type: Type.STRING },
                      website: { type: Type.STRING },
                      linkedin: { type: Type.STRING },
                      github: { type: Type.STRING }
                    },
                    required: ["name", "title", "email", "phone", "location"]
                  },
                  summary: { type: Type.STRING },
                  experience: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        role: { type: Type.STRING },
                        company: { type: Type.STRING },
                        location: { type: Type.STRING },
                        period: { type: Type.STRING },
                        description: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["role", "company", "period", "description"]
                    }
                  },
                  education: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        degree: { type: Type.STRING },
                        institution: { type: Type.STRING },
                        location: { type: Type.STRING },
                        period: { type: Type.STRING },
                        details: { type: Type.STRING }
                      },
                      required: ["degree", "institution", "period"]
                    }
                  },
                  skills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING },
                        items: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["category", "items"]
                    }
                  },
                  references: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        title: { type: Type.STRING },
                        company: { type: Type.STRING },
                        email: { type: Type.STRING },
                        phone: { type: Type.STRING },
                        relationship: { type: Type.STRING }
                      },
                      required: ["name"]
                    }
                  }
                },
                required: ["contact", "summary", "experience", "education", "skills"]
              },
              coverLetter: { type: Type.STRING },
              analysis: {
                type: Type.OBJECT,
                properties: {
                  matchScore: { type: Type.NUMBER },
                  matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyImprovements: { type: Type.STRING },
                },
                required: ["matchScore", "matchedKeywords", "missingKeywords", "keyImprovements"]
              }
            },
            required: ["tailoredResume", "coverLetter", "analysis"]
          },
        }
      })
    );

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const is503 =
      error?.status === 503 ||
      error?.message?.includes("503") ||
      error?.message?.toLowerCase().includes("high demand") ||
      error?.message?.toLowerCase().includes("unavailable");
    if (is503) {
      return res.status(503).json({ error: "AI service is currently at capacity after 3 attempts. Please wait a moment and try again." });
    }
    res.status(500).json({ error: error.message });
  }
});

export default app;

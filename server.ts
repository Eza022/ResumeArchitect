import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const upload = multer({ storage: multer.memoryStorage() });

  // Gemini API setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API routes
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
        try {
          console.log("Attempting local PDF extraction...");
          const pdfParserRaw = require("pdf-parse");
          const parsePdf = typeof pdfParserRaw === "function" ? pdfParserRaw : pdfParserRaw.default;
          if (typeof parsePdf !== "function") {
            throw new Error("Could not resolve pdf-parse system function.");
          }
          const data = await parsePdf(req.file.buffer);
          text = data.text;
          console.log(`Local PDF extraction succeeded. Extracted ${text?.length || 0} characters.`);
        } catch (localPdfErr: any) {
          console.warn("Local PDF extraction failed, trying Gemini fallback...", localPdfErr);
          try {
            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: {
                parts: [
                  {
                    inlineData: {
                      mimeType: "application/pdf",
                      data: req.file.buffer.toString("base64")
                    }
                  },
                  {
                    text: "Extract all text from this resume PDF faithfully. Maintain a logical order. Output ONLY the extracted text content."
                  }
                ]
              }
            });
            text = response.text || "";
            console.log(`Gemini PDF fallback succeeded. Extracted ${text?.length || 0} characters.`);
          } catch (pdfErr: any) {
            console.error("Gemini PDF Extraction Error:", pdfErr);
            if (pdfErr.status === 503 || pdfErr.message?.includes("503")) {
              throw new Error("The AI extraction service is busy. Please try again in a few moments or paste your CV manually.");
            }
            throw new Error(`Failed to extract text from PDF. Error: ${localPdfErr.message || localPdfErr}. Fallback: ${pdfErr.message || pdfErr}`);
          }
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

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `
          You are an expert resume writer and career coach. 
          I will provide a user's current resume and a job description. 
          Your task is to:
          1. Refactor the resume to perfectly tailor it for the job description.
          2. Write a professional cover letter.
          3. Provide a match analysis score (0-100) and identify keywords.

          Guidelines for Resume:
          - Use industry keywords from the job description.
          - Quantify achievements using the STAR method.
          - Ensure ATS compatibility (clean, logical structure).
          - Maintain absolute truthfulness.

          Guidelines for Cover Letter:
          - Address the specific needs and pain points mentioned in the JD.
          - Professional, confident, but humble tone.

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
              tailoredResume: { type: Type.STRING },
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
      });

      const result = JSON.parse(response.text);
      res.json(result);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      if (error.status === 503 || error.message?.includes("503") || error.message?.includes("demand")) {
        return res.status(503).json({ error: "AI service is currently at capacity. Please wait 10 seconds and try again." });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

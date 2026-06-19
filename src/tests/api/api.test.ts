import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../../api/index';

// Mock the Gemini API so we don't make real network requests in our tests
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify({
            tailoredResume: {
              contact: {
                name: 'Jane Doe',
                title: 'Software Engineer',
                email: 'jane@example.com',
                phone: '123-456-7890',
                location: 'City'
              },
              summary: 'Experienced engineer',
              experience: [],
              education: [],
              skills: []
            },
            coverLetter: 'Dear Hiring Manager...',
            analysis: {
              matchScore: 95,
              matchedKeywords: ['React'],
              missingKeywords: ['Node'],
              keyImprovements: 'Add Node'
            }
          })
        })
      };
    },
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY',
      NUMBER: 'NUMBER'
    }
  };
});

describe('Express API Endpoints', () => {
  it('POST /api/extract-text should return 400 without a file', async () => {
    const res = await request(app).post('/api/extract-text');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'No file uploaded' });
  });

  it('POST /api/tailor-resume should return 400 if currentResume is missing', async () => {
    const res = await request(app)
      .post('/api/tailor-resume')
      .send({ jobDescription: 'Looking for a dev' });
    
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing resume or job description' });
  });

  it('POST /api/tailor-resume should return 200 with generated content on success', async () => {
    const res = await request(app)
      .post('/api/tailor-resume')
      .send({
        currentResume: 'My old resume',
        jobDescription: 'New job description'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.coverLetter).toBe('Dear Hiring Manager...');
    expect(res.body.analysis.matchScore).toBe(95);
  });
});

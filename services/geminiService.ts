import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeMarket = async (segment: string): Promise<AnalysisResult> => {
  const modelId = 'gemini-2.5-flash';

  const prompt = `
    Analyze the current global computer workstation market specifically focusing on: "${segment}".
    
    I need a detailed competitive landscape analysis.
    Identify the top 5-7 key players (companies like Dell, HP, Lenovo, Apple, etc. depending on the segment).
    
    Perform a Google Search to get the most recent market share data, revenue estimates, and strategic news for 2024-2025.

    Return the response as a valid JSON object wrapped in a markdown code block (\`\`\`json ... \`\`\`).
    The JSON structure must match this schema:
    {
      "segment": "${segment}",
      "totalMarketValueEst": "Estimate of total market value (e.g. $50B)",
      "summary": "A 2-3 sentence executive summary of the current state of this market segment.",
      "analysisDate": "Current Month Year",
      "players": [
        {
          "name": "Company Name",
          "marketShareEst": 30, // Number representing percentage (0-100)
          "category": "Leader" | "Challenger" | "Niche",
          "strengths": ["Strength 1", "Strength 2"],
          "recentMoves": "One sentence about recent products or strategies."
        }
      ],
      "trends": [
        {
          "trend": "Name of trend (e.g. AI Integration)",
          "impact": "High" | "Medium" | "Low",
          "description": "Short description of the trend."
        }
      ]
    }
    
    Ensure the data is realistic and based on the search results.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT supported with googleSearch in the current SDK version for this specific flow usually, 
        // so we rely on prompt engineering for JSON output.
      },
    });

    const text = response.text || '';
    
    // Extract JSON from markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    let jsonData;
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        jsonData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON block", e);
        // Fallback or re-throw
        throw new Error("Failed to parse AI response.");
      }
    } else {
       // Attempt to parse raw text if no code blocks found
       try {
        jsonData = JSON.parse(text);
       } catch (e) {
         throw new Error("AI did not return valid JSON.");
       }
    }

    // Extract Grounding Metadata
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      data: jsonData,
      sources: sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
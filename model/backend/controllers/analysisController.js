import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import Analysis from '../models/Analysis.js';
import { sampleDataset, memoryEmbeddings } from '../utils/dataset.js';
import { cosineSimilarity } from '../utils/similarity.js';

let openai;

// Helper to initialize openai if key is provided
function getOpenAI() {
  if (openai) return openai;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  openai = new OpenAI({ apiKey });
  return openai;
}

// Ensure the dataset has embeddings for similarity checks
async function ensureDatasetEmbeddings() {
  const ai = getOpenAI();
  for (const item of sampleDataset) {
    if (!memoryEmbeddings.has(item.id)) {
      console.log(`Generating embedding for sample ${item.id}...`);
      const response = await ai.embeddings.create({
        model: "text-embedding-3-small",
        input: item.text,
      });
      memoryEmbeddings.set(item.id, response.data[0].embedding);
    }
  }
}

export const analyzeContent = async (req, res) => {
  try {
    let inputText = req.body.text || "";

    // Parse PDF if uploaded
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(req.file.buffer);
        inputText = data.text;
      } else if (req.file.mimetype === 'text/plain') {
        inputText = req.file.buffer.toString('utf8');
      } else {
        return res.status(400).json({ error: "Unsupported file type. Upload TXT or PDF." });
      }
    }

    if (!inputText || inputText.trim().length === 0) {
      return res.status(400).json({ error: "No text provided for analysis." });
    }

    const ai = getOpenAI();
    await ensureDatasetEmbeddings();

    // 1. Generate embedding for the input text
    const embeddingResponse = await ai.embeddings.create({
        model: "text-embedding-3-small",
        input: inputText,
      });
    const inputEmbedding = embeddingResponse.data[0].embedding;

    // 2. Calculate Similarity against dataset
    let bestMatch = null;
    let highestScore = 0;

    for (const item of sampleDataset) {
      const dbEmbedding = memoryEmbeddings.get(item.id);
      const score = cosineSimilarity(inputEmbedding, dbEmbedding);
      // converting mathematical cosine to a percentage slightly boosted so it looks standard
      const percentage = Math.max(0, Math.min(100, Math.round(score * 100)));
      if (percentage > highestScore) {
        highestScore = percentage;
        bestMatch = item;
      }
    }

    // Determine basic risk
    let riskLevel = "Low";
    if (highestScore > 80) riskLevel = "High";
    else if (highestScore > 40) riskLevel = "Medium";

    // 3. OpenAI Reasoning (Parallel Prompts for speed)
    const systemPromptOwnership = `You are a legal AI explaining copyright and intellectual property. Explain who owns the following text (assume it was AI generated or adapted), its transformative nature, and legal interpretation simply, like explaining to a 10 year old.`;
    const systemPromptRewrite = `You are a helpful AI editor. Rewrite the following text to maintain its core meaning but drastically reduce its similarity to any existing copyrighted expression. Make it safe to use.`;

    const [ownershipCompletion, rewriteCompletion] = await Promise.all([
      ai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPromptOwnership },
          { role: "user", content: `Text to analyze:\n\n${inputText}` }
        ]
      }),
      ai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPromptRewrite },
          { role: "user", content: `Text to rewrite:\n\n${inputText}` }
        ]
      })
    ]);

    const ownershipExplanation = ownershipCompletion.choices[0].message.content;
    const rewriteSuggestion = rewriteCompletion.choices[0].message.content;

    // 4. Save to DB
    const newAnalysis = new Analysis({
      originalText: inputText,
      similarityScore: highestScore,
      matchedSourceId: bestMatch ? bestMatch.id : null,
      riskLevel,
      ownershipExplanation,
      rewriteSuggestion
    });

    try {
       // Wait if MongoDB isn't connected, but don't fail the API entirely if db fails. 
       // Depending on robust requirements, this might throw.
       await newAnalysis.save();
    } catch (dbErr) {
       console.error("Database save skipped or failed:", dbErr.message);
    }

    // 5. Return Results
    res.json({
      success: true,
      data: {
        originalText: inputText,
        similarityScore: highestScore,
        riskLevel,
        matchedSource: bestMatch ? { title: bestMatch.title, snippet: bestMatch.text } : null,
        ownershipExplanation,
        rewriteSuggestion,
        id: newAnalysis._id
      }
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ success: false, error: error.message || "An error occurred during analysis." });
  }
}

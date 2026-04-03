# AI Copyright Guardian

## Problem Statement
The proliferation of large language models trained on massive, unstructured datasets has resulted in a new IP crisis: AI occasionally outputs near-verbatim copies of prior copyrighted human works. Users integrating AI into commercial products face legal risks and ambiguity surrounding ownership, originality, and transformative use.

## Approach
**AI Copyright Guardian** is a platform designed to check text for potential copyright overlap. It:
1. Translates text (or PDFs) into high-dimensional vector embeddings using OpenAI (`text-embedding-3-small`).
2. Performs a Cosine-Similarity search against an internal index of guarded/pre-established intellectual property.
3. Automatically triggers an OpenAI analytical pass to:
   * Evaluate legal risk based on similarity metrics.
   * Provide an "Explain Like I'm 10" ownership summary.
   * Offer safe rewritten alternatives.
4. Provides a professional dashboard summarizing the risk level and overlaps, and enables generating a PDF Plagiarism Report.

## Tech Stack
**Frontend:** React.js, Vite, Tailwind CSS, html2pdf.js, Lucide-React
**Backend:** Node.js, Express, Mongoose (MongoDB), Multer, pdf-parse
**AI/Models:** OpenAI API (GPT-3.5-Turbo + Embeddings)

## Screenshots
*(Add screenshots of the interface here after initial local run)*

## Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas cluster)
- OpenAI API Key

## Setup and Running Local Server
1. Clone the repository.
2. Navigate to `/backend` and install dependencies: `npm install`.
3. Create a `.env` in `/backend` using `.env.example` as a template.
4. Start backend: `npm start`.
5. Navigate to `/frontend` and install dependencies: `npm install`.
6. Start frontend process: `npm run dev`.
7. Visit the dashboard at `http://localhost:5173`.

## Future Scope
* **Vector DB Integration:** Implementing Pinecone or Milvus to quickly search millions of copyrighted texts instantly rather than the small sample space.
* **Document formatting preservation:** Retain document styles (Word/PDF) during the rewrite suggestions phase.
* **Open Source LLM Replacement:** Support for local embedding models (e.g., SentenceTransformers via Xenova/Transformers) to keep data processing 100% offline.

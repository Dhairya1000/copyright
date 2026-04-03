# 🛡️ AI Copyright Guardian

**AI-powered intellectual property protection — right in your browser.**

AI Copyright Guardian analyzes text for potential copyright overlap using Google's Gemini API. It generates semantic embeddings, computes cosine similarity against a virtual dataset of copyrighted works, and produces legal interpretations alongside safe rewrite suggestions — all without a backend server.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Semantic Embedding** | Converts text into high-dimensional vector embeddings via `gemini-embedding-001` |
| **Cosine Similarity Engine** | Computes pairwise similarity between user input and a curated dataset of copyrighted texts |
| **Risk Assessment** | Classifies infringement risk as **Low**, **Medium**, or **High** based on similarity thresholds |
| **Legal Interpretation (ELI10)** | Uses `gemini-2.5-flash` to explain ownership and copyright in simple language |
| **Safe Rewrite Generation** | Automatically rewrites flagged content to reduce similarity while preserving meaning |
| **Report Export** | Download a PNG snapshot of the full analysis dashboard |
| **Zero Install** | Runs entirely in the browser — no Node.js, no database, no server required |

---

## 🧠 How It Works

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  User Input  │────▶│  Gemini Embedding │────▶│ Cosine Similarity│
│  (Text)      │     │  (768-dim vector) │     │  vs. Dataset     │
└──────────────┘     └───────────────────┘     └────────┬─────────┘
                                                        │
                                               ┌────────▼─────────┐
                                               │  Risk Assessment │
                                               │  Low/Medium/High │
                                               └────────┬─────────┘
                                                        │
                              ┌──────────────────────────┼──────────────────────────┐
                              │                          │                          │
                     ┌────────▼────────┐       ┌─────────▼────────┐      ┌──────────▼─────────┐
                     │  Similarity %   │       │ Legal ELI10      │      │ Safe Rewrite       │
                     │  + Visual Gauge │       │ Interpretation   │      │ Suggestion         │
                     └─────────────────┘       └──────────────────┘      └────────────────────┘
```

1. **Embed** — Your text is converted into a 768-dimensional vector using Gemini's embedding model.
2. **Compare** — Cosine similarity is computed against three pre-indexed copyrighted samples.
3. **Assess** — A risk level is assigned: `>80% → High`, `>40% → Medium`, `≤40% → Low`.
4. **Explain** — Gemini generates a child-friendly legal ownership explanation.
5. **Rewrite** — Gemini produces an original rewrite that retains the core meaning.

---

## 📂 Project Structure

```
ai-copyright-guardian/
├── model/
│   ├── AI_Copyright_Guardian.html   # 🚀 Standalone browser app (open this!)
│   ├── README.md
│   ├── backend/                     # Node.js/Express backend (optional)
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── controllers/
│   │   │   └── analysisController.js
│   │   ├── models/
│   │   │   └── Analysis.js
│   │   └── utils/
│   │       ├── dataset.js
│   │       └── similarity.js
│   └── frontend/                    # React/Vite frontend (optional)
│       ├── package.json
│       ├── index.html
│       ├── vite.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       └── src/
│           ├── App.jsx
│           ├── main.jsx
│           ├── index.css
│           └── components/
│               ├── Dashboard.jsx
│               └── InputModule.jsx
└── README.md
```

---

## 🚀 Quick Start

### Option 1: Zero-Install Browser App (Recommended)

Simply open the standalone HTML file in any modern browser:

```bash
# Clone the repository
git clone https://github.com/Dhairya1000/copyright.git
cd copyright

# Open in browser
start model/AI_Copyright_Guardian.html    # Windows
open model/AI_Copyright_Guardian.html     # macOS
xdg-open model/AI_Copyright_Guardian.html # Linux
```

> **Note:** The standalone app requires an internet connection for API calls to Google Gemini.

### Option 2: Full-Stack Development Setup

#### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

#### Backend
```bash
cd model/backend
npm install
cp .env.example .env   # Add your API keys
npm start
```

#### Frontend
```bash
cd model/frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the development dashboard.

---

## 🎨 Tech Stack

| Layer | Technologies |
|---|---|
| **Standalone App** | HTML5, React 18 (CDN), Tailwind CSS (CDN), Babel, Lucide Icons, html2canvas |
| **Frontend** | React.js, Vite, Tailwind CSS, Lucide-React |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB), Multer, pdf-parse |
| **AI / Models** | Google Gemini API (`gemini-embedding-001` + `gemini-2.5-flash`) |

---

## 📊 Sample Dataset

The prototype checks input against three simulated copyrighted sources:

| # | Title | Genre |
|---|---|---|
| 1 | *The Silent Cosmos* | Science Fiction |
| 2 | *Corporate Synergy Report* | Business / Corporate |
| 3 | *Quantum Computing Basics* | Academic / Technical |

> **Tip:** Try pasting text related to these topics to see the detection engine in action.

---

## 🔮 Future Scope

- **Vector DB Integration** — Pinecone or Milvus for searching millions of copyrighted texts at scale
- **Document Format Preservation** — Retain Word/PDF styling during rewrite suggestions
- **Open Source LLM Support** — Local embedding models (e.g., SentenceTransformers) for fully offline processing
- **Batch Analysis** — Upload multiple documents for bulk copyright scanning
- **API Endpoints** — RESTful API for programmatic integration into CI/CD pipelines

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using Google Gemini AI
</p>

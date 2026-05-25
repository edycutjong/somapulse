<div align="center">
  <h1>SomaPulse 🩺</h1>
  <p><em>Offline-first medical triage and diagnostic translation at the edge — zero cloud, zero network, zero excuses</em></p>
  <img src="docs/readme-hero.png" alt="SomaPulse" width="100%">

  <br/>

  [![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-22c55e?style=for-the-badge)](https://somapulse.edycu.dev)
  [![Pitch Deck](https://img.shields.io/badge/📊_Pitch-Deck-10b981?style=for-the-badge)](https://somapulse.edycu.dev/pitch.html)
  [![Tests](https://img.shields.io/badge/✅_Tests-48_passing-22c55e?style=for-the-badge)](#-testing--ci)
  [![Built for UOE](https://img.shields.io/badge/UOE-Summer_of_Code_2026-8b5cf6?style=for-the-badge)](https://uoe-summer-of-code.devpost.com/)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
  ![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
  ![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=flat&logo=python&logoColor=white)
  [![CI](https://github.com/edycutjong/somapulse/actions/workflows/ci.yml/badge.svg)](https://github.com/edycutjong/somapulse/actions/workflows/ci.yml)

</div>

---

## 💡 The Problem & Solution

When disasters strike, **communication grids collapse first**. Rural health workers are stranded without access to cloud AI tools, unable to match colloquial symptom descriptions ("running stomach", "fire in the chest") to formal clinical protocols ("gastroenteritis", "GERD").

**SomaPulse** brings clinical intelligence to the edge. It transcribes spoken symptoms using local Whisper.cpp, maps colloquial terms to medical ontologies via SapBERT embeddings, and retrieves matching protocols from a local sqlite-vec database — all in **under 120ms** with **zero internet**.

**Key Features:**
- 🎤 **Edge Speech Ingestion**: HTML5 audio → local Whisper.cpp transcription (38ms p50)
- 🧬 **SapBERT Semantic Mapping**: Aligns colloquial dialect terms to UMLS clinical concepts
- 💊 **Protocol Retrieval**: Cosine similarity search against pre-seeded medical guidelines
- ⚠️ **Drug Contraindication Warnings**: Critical interaction alerts rendered instantly
- 🔌 **100% Offline**: No network, no cloud API, no subscriptions — runs on a $300 laptop

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    Responder([Field Responder]) <-->|Audio Recording / Web UI| UI[Next.js 16 / React 19 Frontend]
    UI <-->|Local API calls| API[Python FastAPI Backend]
    API <-->|Speech Stream| Whisper[Whisper.cpp <br/> GGML 16-bit Quantized]
    API <-->|Extract Symptoms| ONNX[SapBERT ONNX Runtime <br/> 384-dim Biomedical Embeddings]
    API <-->|Vector Distance Query| SQLite[SQLite + sqlite-vec <br/> Cosine Similarity Search]
```

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| **Backend** | Python 3.12, FastAPI |
| **Transcription** | Whisper.cpp (16-bit GGML, CPU-optimized) |
| **NLP Embeddings** | SapBERT (ONNX-runtime, 384-dim biomedical vectors) |
| **Vector Search** | SQLite + sqlite-vec (cosine similarity) |

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm
- Python 3.12 (for backend + benchmark scripts)

### Installation
```bash
git clone https://github.com/edycutjong/somapulse.git
cd somapulse
npm install
cp .env.example .env.local
npm run dev
```

### Seed the local protocol database
```bash
python seed.py   # Creates protocols.db with 142 pre-compiled SapBERT protocol vectors
```

### Run the latency benchmark
```bash
python bench.py  # Validates full pipeline meets <200ms target (p50: ~58ms, p95: ~71ms)
```

## 🧪 Testing & CI

**48 passing tests** across 4 test suites — covering mock data integrity, component rendering, interactive triage selection, voice recording state, vocabulary mapping validation, UMLS code format checks, and edge/offline system health branching.

```bash
npm test              # Run all 48 tests
npm run test:coverage # Coverage report
npm run lint          # ESLint
npm run typecheck     # TypeScript check
npm run build         # Production build
npm run ci            # Full CI pipeline (lint + typecheck + test + build)
```

CI runs on Node.js 20, 22, and 24 via GitHub Actions on every push.

## 📁 Project Structure
```
devpost-uoe-somapulse/
├── docs/              # README assets
├── src/
│   ├── app/           # Next.js pages + __tests__/
│   └── lib/           # Mock data & utilities + __tests__/
├── .github/           # CI workflows
├── bench.py           # Pipeline latency benchmark script
├── seed.py            # Deterministic protocol database seeder
├── .env.example       # Environment template
├── LICENSE            # MIT
└── README.md          # You are here
```

## Acknowledged Limitation
**Pre-Seeded Knowledge**: The model runs entirely offline. It cannot answer open-ended medical inquiries outside the pre-seeded protocol indexes. Novel conditions require a new offline sync to expand the local database.

## 📄 License
[MIT](LICENSE) © 2026 Edy Cu

## 🙏 Acknowledgments
Built for **UOE Summer of Code 2026**. Thank you to the organizers and judges for the opportunity.

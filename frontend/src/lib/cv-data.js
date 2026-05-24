/**
 * Single source of truth for CV content. Imported by the print route
 * (/p/cv/print) which renders the PDF-bound version, and available to any
 * future surface (e.g. an inline CV viewer) without duplicating data.
 *
 * Phone, address, and other personal contact details that are not already
 * public stay out of the repo by design.
 */

export const identity = {
  name: 'Abdullah AL NAHAS',
  surname: 'BAKIRCI',
  role: 'Senior AI Engineer · GenAI & NLP · Recommender Systems',
  location: 'Istanbul, Turkey · GMT+3',
  links: [
    { label: 'abdullah.nahass@gmail.com', href: 'mailto:abdullah.nahass@gmail.com' },
    { label: 'linkedin.com/in/abdullah-al-nahas-537bb967', href: 'https://www.linkedin.com/in/abdullah-al-nahas-537bb967/' },
    { label: 'github.com/abdullah-alnahas', href: 'https://github.com/abdullah-alnahas' },
    { label: 'huggingface.co/abdullah-alnahas', href: 'https://huggingface.co/abdullah-alnahas' },
  ],
};

export const summary =
  'Senior AI Engineer with 7+ years of experience in NLP, machine learning, and deep learning, specializing in Arabic, English and Turkish NLP, semantic search, recommender systems, and GenAI/LLM applications. Proven track record of building and deploying production ML systems that drive measurable business impact: hybrid search APIs improving e-commerce relevance, data pipelines processing, and RAG systems. Experienced in mentoring engineers and contributing to open-source projects. Based in Istanbul (GMT+3), experienced working with distributed teams across EMEA, MENA, and US time zones.';

export const roles = [
  {
    org: 'Hudhud Maps', location: 'Remote',
    title: 'Senior Data Scientist', dates: 'Mar 2025 – Feb 2026',
    bullets: [
      'Designed and built an 18-stage data processing pipeline for POI (Point of Interest) cleansing, deduplication, and enrichment, processing 70K+ records per city across 25+ Saudi Arabian cities.',
      'Developed an advanced deduplication module combining fuzzy string matching, geospatial KD-Tree indexing, phonetic algorithms, and sentence embeddings to identify and merge duplicate POIs with high precision.',
      'Built an LLM-powered Arabic/English name normalization system using DSPy, featuring multi-layer caching (SQLite, Redis), async processing, and Pydantic-validated structured outputs.',
      'Trained CatBoost classifiers for POI quality scoring, brand detection, and category classification, using an ensemble approach combining fuzzy matching, embeddings, and ML classification.',
      'Engineered a configurable brand matching system using an ensemble of fuzzy matching, sentence-transformer embeddings, and ML classifiers to accurately link POIs to known brands.',
      'Built a multi-stage data ingestion system for the Hudhud POI Portal API with bulk processing, resume/retry capabilities, and exponential backoff.',
    ],
    tech: 'Python, Pandas, Polars, DuckDB, CatBoost, Sentence-Transformers, DSPy, GeoPandas, RapidFuzz, OpenAI API, Google Gemini API, PostgreSQL, asyncio, Playwright',
  },
  {
    org: 'SAP', location: 'Remote',
    title: 'Senior AI Engineer', dates: 'Jul 2024 – Dec 2024',
    bullets: [
      "Built an LLM-assisted support-ticket processing pipeline that automatically classified incoming tickets and drafted responses for human review, orchestrated through Celery for asynchronous handling and integrated with SAP's support infrastructure via REST APIs.",
    ],
    tech: 'Python, LLMs, Celery, FastAPI, REST APIs',
  },
  {
    org: 'Independent AI Consultant', location: 'Turkey',
    title: 'Freelance — GenAI & NLP Projects', dates: 'Oct 2023 – Jul 2024',
    bullets: [
      'Developed a top-5 solution in the Topcoder RAG Challenge, competing against hundreds of international participants in building production-quality retrieval-augmented generation systems.',
      'Active contributor to the open-source project Ansari: built an LLM comparison Gradio app inspired by LMSys for A/B testing prompt and agent changes before release; built the CI pipeline from scratch, preventing regressions after prompt changes.',
      'Integrated a vast Islamic knowledge source (Mawsuah) into Ansari that reduces hallucinations on practical matters.',
      "Improved Ansari's user authorization system to include refresh tokens with rotation, resulting in a more seamless and secure user experience.",
    ],
    tech: 'Python, LangChain, OpenAI API, Gradio, FastAPI, Docker, CI/CD (GitHub Actions)',
  },
  {
    org: 'Klevu Oy', location: 'Remote',
    title: 'Senior NLP Engineer', dates: 'Feb 2022 – Oct 2023',
    bullets: [
      "Developed a semantic text search API using OpenSearch and FastAPI, enhancing overall search relevance and performance when integrated with Klevu's existing text search APIs serving thousands of e-commerce merchants.",
      'Utilized prompt engineering with GPT-4 to generate complete-the-look product recommendations, increasing cross-sell opportunities for fashion e-commerce clients.',
      'Enhanced e-commerce search functionality through text and image-based catalog enrichment: word decompounding, domain classification, review analysis, context-aware synonym extraction, image captioning, and aspect-based sentiment analysis.',
      'Designed and developed semantic image search endpoints to improve e-commerce product discovery through visual similarity.',
      'Prototyped knowledge graph construction and search using TypeDB for efficient product relationship management and retrieval.',
      'Trained an intent classifier for an e-commerce chatbot, improving customer interaction accuracy and support automation.',
    ],
    tech: 'Python, scikit-learn, Pandas, NumPy, PyTorch, PyTorch Lightning, Hugging Face Transformers, TensorFlow, Keras, TF Serving, TorchServe, NVIDIA Triton, OpenSearch, ElasticSearch, FastAPI, Docker, NLTK, Stanza, spaCy, Rasa, TypeDB',
  },
  {
    org: 'Data Friendly Space', location: 'Remote',
    title: 'NLP Engineer', dates: 'Mar 2021 – Feb 2022',
    bullets: [
      'Designed and developed NLP models for assisted tagging in a secondary data analysis platform, used for humanitarian needs assessments and disaster situation analysis across multiple UN and NGO partners.',
      'Owned the full project lifecycle: data cleaning, model design and training, production preparation, deployment, and iterative improvement based on user feedback.',
      'Hired, trained, and led a team of interns, establishing workflows and code review practices for the NLP team.',
    ],
    tech: 'Python, PyTorch, PyTorch Lightning, Hugging Face Transformers, Docker, PostgreSQL, Streamlit',
  },
  {
    org: 'DonanimHaber', location: 'Istanbul, Turkey',
    title: 'Machine Learning Engineer', dates: 'Sep 2019 – Jan 2021',
    bullets: [
      "Designed and developed a hybrid topic recommender system for a forum with 1M+ users, combining item2vec, content-based filtering, and a graph-based algorithm adapted from Pinterest's Pixie for real-time recommendations.",
      'Trained a toxic message classifier for content moderation, reducing manual review workload and improving community safety.',
      'Built a topic classification model to assist users in posting to the most relevant sub-forum, improving content organization.',
    ],
    tech: 'Python, Pandas, NumPy, scikit-learn, Cython, PyTorch, PyTorch Lightning, Hugging Face Transformers, TensorFlow, Keras, Docker, FastAPI',
  },
  {
    org: 'Technology Transfer Office, Gebze Technical University', location: 'Kocaeli, Turkey',
    title: 'NLP Research Engineer', dates: 'Jan 2018 – Sep 2019',
    bullets: [
      'Developed sentiment analysis and named entity recognition (NER) models for Turkish-language Tweets, contributing to social media analytics research.',
      'Developed offline trend detection models for large-scale Tweet corpora, identifying emerging topics and patterns.',
    ],
    tech: 'Python, PyTorch, scikit-learn, Pandas, TensorFlow, Keras',
  },
];

export const projects = [
  { title: 'Topcoder RAG Challenge — Top 5 Solution', body: 'Built a production-grade RAG system that ranked in the top 5 internationally, demonstrating retrieval, embedding, and generation pipeline design.' },
  { title: 'Ansari (Open Source)', body: 'Core contributor to an Islamic AI assistant. Built LLM A/B comparison tooling (Gradio), CI pipeline, knowledge source integration, and auth system improvements.' },
  { title: 'Multiple open-source RAG projects', body: 'Demonstrating retrieval-augmented generation patterns with various embedding and generation strategies.' },
];

export const education = [
  { title: 'MSc in Computer Engineering', body: 'Specialization in AI & NLP (Sep 2016 – Sep 2019). Thesis focus: Natural Language Processing. Coursework in machine learning, deep learning, and computational linguistics.' },
  { title: 'BS in Computer Science and Engineering', body: 'Specialization in AI & NLP (Sep 2010 – Sep 2015).' },
];

export const skills = [
  ['Languages', 'Python (primary), SQL'],
  ['ML / DL Frameworks', 'PyTorch, PyTorch Lightning, TensorFlow, Keras, scikit-learn, CatBoost, Hugging Face Transformers, Sentence-Transformers'],
  ['GenAI & LLMs', 'DSPy, RAG architectures, prompt engineering'],
  ['NLP', 'spaCy, NLTK, Stanza, RapidFuzz, text classification, NER, sentiment analysis, semantic search, aspect-based sentiment analysis'],
  ['Search & RecSys', 'OpenSearch, ElasticSearch, vector databases, item2vec, content-based filtering, collaborative filtering, graph-based recommendations (Pixie)'],
  ['Serving & Infra', 'FastAPI, Docker, TorchServe, TensorFlow Serving, NVIDIA Triton, Celery, asyncio'],
  ['Data & Databases', 'Pandas, Polars, DuckDB, NumPy, PostgreSQL, SQLite, Redis, GeoPandas'],
  ['Tools & CI/CD', 'Git, GitHub Actions, CI/CD pipelines, Streamlit, Gradio, Playwright'],
];

export const spoken = ['Arabic (Native)', 'English (Fluent)', 'Turkish (Fluent)'];

/**
 * Palettes available across the site (theme picker dial, CV download
 * dialog, /p/cv/print). Names are evocative (paper, ink, ember, …) — never
 * tied to a vendor or product. `swatch` is the resolved --accent for the
 * light variant of each palette and is used by chrome that needs to render
 * a static dot (the radial dial reads it directly so it doesn't have to
 * mount the palette into the document to learn the colour).
 *
 * Order matters: the dial places palettes around an invisible circle in
 * this exact sequence, starting at 12 o'clock and walking clockwise. The
 * sequence is a colour-wheel walk — neutral → warm (brown → orange → gold)
 * → green → cool blue → violet → pink-red → back to neutral — so adjacent
 * dots are always perceptually close to each other and the whole dial reads
 * as a coherent gradient rather than a random list.
 */
export const PALETTES = [
  { id: 'paper',    label: 'Paper',    swatch: '#1E252D'                  },
  { id: 'sepia',    label: 'Sepia',    swatch: '#6b3a12'                  },
  { id: 'cream',    label: 'Cream',    swatch: 'oklch(0.58 0.16 35)'      },
  { id: 'ember',    label: 'Ember',    swatch: '#ff4f00'                  },
  { id: 'amber',    label: 'Amber',    swatch: '#c08a18'                  },
  { id: 'forest',   label: 'Forest',   swatch: 'oklch(0.50 0.13 150)'     },
  { id: 'slate',    label: 'Slate',    swatch: 'oklch(0.55 0.16 250)'     },
  { id: 'ink',      label: 'Ink',      swatch: '#1e3a8a'                  },
  { id: 'harbor',   label: 'Harbor',   swatch: '#002060'                  },
  { id: 'midnight', label: 'Midnight', swatch: 'oklch(0.55 0.18 290)'     },
  { id: 'magenta',  label: 'Magenta',  swatch: '#d9156f'                  },
  { id: 'rose',     label: 'Rose',     swatch: '#C12A58'                  },
  { id: 'mono',     label: 'Mono',     swatch: 'oklch(0.30 0 0)'          },
];

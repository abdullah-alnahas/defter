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
  'Senior AI Engineer with 7+ years of experience in NLP, machine learning, and deep learning, with work in Arabic, English, and Turkish. Focus areas: semantic search, recommender systems, data pipelines, and LLM/RAG applications. Experience building and deploying production ML systems — semantic search APIs for e-commerce, large-scale POI cleansing and enrichment pipelines, recommender systems, and RAG prototypes. Some experience mentoring junior engineers and contributing to open-source projects. Based in Istanbul (GMT+3), used to working with distributed teams across EMEA, MENA, and US time zones.';

export const roles = [
  {
    org: 'Hudhud Maps', location: 'Remote',
    title: 'Senior Data Scientist', dates: 'Mar 2025 – Feb 2026',
    bullets: [
      'Designed and built an 18-stage data processing pipeline for POI (Point of Interest) cleansing, deduplication, and enrichment, processing 70K+ records per city across multiple Saudi Arabian cities.',
      'Developed a deduplication module combining fuzzy string matching, geospatial KD-Tree indexing, phonetic algorithms, and sentence embeddings to identify and merge duplicate POIs.',
      'Built an LLM-based Arabic/English name normalization step using DSPy, with multi-layer caching (SQLite, Redis), async processing, and Pydantic-validated structured outputs.',
      'Trained CatBoost classifiers for POI quality scoring, brand detection, and category classification, combined with fuzzy matching and embeddings in an ensemble.',
      'Built a configurable brand matching system combining fuzzy matching, sentence-transformer embeddings, and ML classifiers to link POIs to known brands.',
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
      'Placed top-5 in the Topcoder RAG Challenge, building a retrieval-augmented generation system end-to-end.',
      'Contributed to the open-source project Ansari (Islamic AI assistant): built an LLM comparison Gradio app inspired by LMSys for A/B testing prompt and agent changes; set up the CI pipeline from scratch to catch regressions on prompt changes.',
      'Integrated the Mawsuah Islamic knowledge source into Ansari to ground answers on practical matters.',
      "Reworked Ansari's user authorization to use refresh tokens with rotation.",
    ],
    tech: 'Python, LangChain, OpenAI API, Gradio, FastAPI, Docker, CI/CD (GitHub Actions)',
  },
  {
    org: 'Klevu Oy', location: 'Remote',
    title: 'Senior NLP Engineer', dates: 'Feb 2022 – Oct 2023',
    bullets: [
      "Built a semantic text search API using OpenSearch and FastAPI, designed to be combined with Klevu's existing keyword search APIs serving e-commerce merchants.",
      'Used prompt engineering with GPT-4 to generate complete-the-look product recommendations for fashion e-commerce clients.',
      'Worked on text- and image-based catalog enrichment: word decompounding, domain classification, review analysis, context-aware synonym extraction, image captioning, and aspect-based sentiment analysis.',
      'Built semantic image search endpoints for product discovery via visual similarity.',
      'Prototyped knowledge graph construction and search using TypeDB for product relationship management and retrieval.',
      'Trained an intent classifier for an e-commerce chatbot.',
    ],
    tech: 'Python, scikit-learn, Pandas, NumPy, PyTorch, PyTorch Lightning, Hugging Face Transformers, TensorFlow, Keras, TF Serving, TorchServe, NVIDIA Triton, OpenSearch, ElasticSearch, FastAPI, Docker, NLTK, Stanza, spaCy, Rasa, TypeDB',
  },
  {
    org: 'Data Friendly Space', location: 'Remote',
    title: 'NLP Engineer', dates: 'Mar 2021 – Feb 2022',
    bullets: [
      'Developed NLP models for assisted tagging in a secondary data analysis platform, used for humanitarian needs assessments and disaster situation analysis by UN and NGO partners.',
      'Owned the full project lifecycle: data cleaning, model design and training, deployment, and iteration based on user feedback.',
      'Hired and trained a small team of interns and set up code review practices for the NLP team.',
    ],
    tech: 'Python, PyTorch, PyTorch Lightning, Hugging Face Transformers, Docker, PostgreSQL, Streamlit',
  },
  {
    org: 'DonanimHaber', location: 'Istanbul, Turkey',
    title: 'Machine Learning Engineer', dates: 'Sep 2019 – Jan 2021',
    bullets: [
      "Built a hybrid topic recommender system for a forum with 1M+ users, combining item2vec, content-based filtering, and a graph-based algorithm adapted from Pinterest's Pixie for real-time recommendations.",
      'Trained a toxic message classifier for content moderation.',
      'Built a topic classification model to suggest the most relevant sub-forum when posting.',
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
  { title: 'Topcoder RAG Challenge — Top 5', body: 'Built a retrieval-augmented generation system end-to-end (retrieval, embeddings, generation) that placed in the top 5.' },
  { title: 'Ansari (Open Source)', body: 'Past contributor to an Islamic AI assistant. Built LLM A/B comparison tooling (Gradio), CI pipeline, Mawsuah knowledge source integration, and refresh-token auth.' },
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
  { id: 'copper',   label: 'Copper',   swatch: '#B26A2B'                  },
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

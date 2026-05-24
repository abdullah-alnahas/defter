<script>
  import Page from '$lib/components/Page.svelte';
  import { page } from '$app/state';
  const canonical = $derived(page.url.href);

  /* Roles, projects, education, skills are rendered from this single source.
     Personal contact details that aren't already public elsewhere (phone, address)
     stay out of the repo by design. Edits land here. */
  const roles = [
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
        "Active contributor to the open-source project Ansari: built an LLM comparison Gradio app inspired by LMSys for A/B testing prompt and agent changes before release; built the CI pipeline from scratch, preventing regressions after prompt changes.",
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

  const projects = [
    { title: 'Topcoder RAG Challenge — Top 5 Solution', body: 'Built a production-grade RAG system that ranked in the top 5 internationally, demonstrating retrieval, embedding, and generation pipeline design.' },
    { title: 'Ansari (Open Source)', body: 'Core contributor to an Islamic AI assistant. Built LLM A/B comparison tooling (Gradio), CI pipeline, knowledge source integration, and auth system improvements.' },
    { title: 'Multiple open-source RAG projects', body: 'Demonstrating retrieval-augmented generation patterns with various embedding and generation strategies.' },
  ];

  const education = [
    { title: 'MSc in Computer Engineering', body: 'Specialization in AI & NLP (Sep 2016 – Sep 2019). Thesis focus: Natural Language Processing. Coursework in machine learning, deep learning, and computational linguistics.' },
    { title: 'BS in Computer Science and Engineering', body: 'Specialization in AI & NLP (Sep 2010 – Sep 2015).' },
  ];

  const skills = [
    ['Languages', 'Python (primary), SQL'],
    ['ML / DL Frameworks', 'PyTorch, PyTorch Lightning, TensorFlow, Keras, scikit-learn, CatBoost, Hugging Face Transformers, Sentence-Transformers'],
    ['GenAI & LLMs', 'DSPy, RAG architectures, prompt engineering'],
    ['NLP', 'spaCy, NLTK, Stanza, RapidFuzz, text classification, NER, sentiment analysis, semantic search, aspect-based sentiment analysis'],
    ['Search & RecSys', 'OpenSearch, ElasticSearch, vector databases, item2vec, content-based filtering, collaborative filtering, graph-based recommendations (Pixie)'],
    ['Serving & Infra', 'FastAPI, Docker, TorchServe, TensorFlow Serving, NVIDIA Triton, Celery, asyncio'],
    ['Data & Databases', 'Pandas, Polars, DuckDB, NumPy, PostgreSQL, SQLite, Redis, GeoPandas'],
    ['Tools & CI/CD', 'Git, GitHub Actions, CI/CD pipelines, Streamlit, Gradio, Playwright'],
  ];

  const spoken = ['Arabic (Native)', 'English (Fluent)', 'Turkish (Fluent)'];

  const summary = 'Senior AI Engineer with 7+ years of experience in NLP, machine learning, and deep learning, specializing in Arabic, English and Turkish NLP, semantic search, recommender systems, and GenAI/LLM applications. Proven track record of building and deploying production ML systems that drive measurable business impact: hybrid search APIs improving e-commerce relevance, data pipelines processing, and RAG systems. Experienced in mentoring engineers and contributing to open-source projects. Based in Istanbul (GMT+3), experienced working with distributed teams across EMEA, MENA, and US time zones.';
</script>

<svelte:head>
  <title>CV — Abdullah AL NAHAS</title>
  <meta name="description" content="CV — Senior AI Engineer · GenAI & NLP · Recommender Systems. Istanbul, GMT+3." />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="CV — Abdullah AL NAHAS" />
  <meta property="og:description" content="CV — Senior AI Engineer · GenAI & NLP · Recommender Systems. Istanbul, GMT+3." />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Page title="" lang="en" dir="ltr">
  <header class="cv-hero">
    <h1>Abdullah AL NAHAS <span class="surname">(BAKIRCI)</span></h1>
    <p class="role">Senior AI Engineer · GenAI &amp; NLP · Recommender Systems</p>
    <p class="meta">Istanbul, Turkey · GMT+3</p>
    <ul class="contact">
      <li><a href="mailto:abdullah.nahass@gmail.com">abdullah.nahass@gmail.com</a></li>
      <li><a href="https://www.linkedin.com/in/abdullah-al-nahas-537bb967/" rel="me noopener noreferrer external" target="_blank">LinkedIn</a></li>
      <li><a href="https://github.com/abdullah-alnahas" rel="me noopener noreferrer external" target="_blank">GitHub</a></li>
      <li><a href="https://huggingface.co/abdullah-alnahas" rel="me noopener noreferrer external" target="_blank">HuggingFace</a></li>
    </ul>
  </header>

  <section class="cv-section">
    <h2>Summary</h2>
    <p>{summary}</p>
  </section>

  <section class="cv-section">
    <h2>Work Experience</h2>
    {#each roles as r (r.org + r.dates)}
      <article class="role-block">
        <header class="role-head">
          <div>
            <h3>{r.org} <span class="loc">— {r.location}</span></h3>
            <p class="role-title">{r.title}</p>
          </div>
          <time>{r.dates}</time>
        </header>
        <ul>
          {#each r.bullets as b}<li>{b}</li>{/each}
        </ul>
        <p class="tech"><strong>Technologies:</strong> {r.tech}</p>
      </article>
    {/each}
  </section>

  <section class="cv-section">
    <h2>Projects</h2>
    <ul class="defs">
      {#each projects as p}<li><strong>{p.title}</strong> — {p.body}</li>{/each}
    </ul>
  </section>

  <section class="cv-section">
    <h2>Education</h2>
    <ul class="defs">
      {#each education as e}<li><strong>{e.title}</strong> — {e.body}</li>{/each}
    </ul>
  </section>

  <section class="cv-section">
    <h2>Skills</h2>
    <dl class="skills">
      {#each skills as [k, v]}
        <dt>{k}</dt><dd>{v}</dd>
      {/each}
    </dl>
  </section>

  <section class="cv-section">
    <h2>Languages</h2>
    <ul class="inline">
      {#each spoken as l}<li>{l}</li>{/each}
    </ul>
  </section>
</Page>

<style>
  .cv-hero {
    margin: 0 0 2.5rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--rule);
  }
  .cv-hero h1 {
    margin: 0 0 0.25rem;
    font-size: 1.85rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: var(--accent);
  }
  .cv-hero h1 .surname {
    color: var(--muted);
    font-weight: 400;
  }
  .cv-hero .role {
    margin: 0 0 0.15rem;
    color: var(--fg);
    font-size: 1.02rem;
  }
  .cv-hero .meta {
    margin: 0 0 0.85rem;
    color: var(--muted);
    font-size: 0.92rem;
  }
  .cv-hero .contact {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1rem;
    font-size: 0.92rem;
  }
  .cv-hero .contact a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 160ms ease;
  }
  .cv-hero .contact a:hover,
  .cv-hero .contact a:focus-visible {
    border-bottom-color: var(--accent);
  }

  .cv-section { margin: 0 0 2rem; }
  .cv-section h2 {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 0.9rem;
  }
  .cv-section p { margin: 0 0 0.8rem; }

  .role-block {
    margin: 0 0 1.6rem;
    padding: 0 0 1.2rem;
    border-bottom: 1px solid var(--rule);
  }
  .role-block:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .role-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 0.6rem;
  }
  .role-head h3 {
    margin: 0;
    font-size: 1.02rem;
    font-weight: 600;
    color: var(--fg);
  }
  .role-head h3 .loc {
    color: var(--muted);
    font-weight: 400;
    font-size: 0.95rem;
  }
  .role-head .role-title {
    margin: 0.1rem 0 0;
    color: var(--accent);
    font-size: 0.95rem;
  }
  .role-head time {
    color: var(--muted);
    font-size: 0.88rem;
    font-variant-numeric: tabular-nums;
    flex: 0 0 auto;
  }
  .role-block ul {
    margin: 0 0 0.7rem;
    padding-inline-start: 1.1rem;
  }
  .role-block ul li {
    margin-bottom: 0.35rem;
    line-height: 1.6;
  }
  .role-block .tech {
    margin: 0;
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.55;
  }
  .role-block .tech strong { color: var(--fg); font-weight: 500; }

  .defs {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .defs li {
    margin: 0 0 0.6rem;
    line-height: 1.6;
  }
  .defs li strong { color: var(--accent); font-weight: 600; }

  .skills {
    display: grid;
    grid-template-columns: 12rem 1fr;
    gap: 0.55rem 1.2rem;
    margin: 0;
  }
  .skills dt {
    color: var(--accent);
    font-weight: 500;
    font-size: 0.92rem;
  }
  .skills dd {
    margin: 0;
    color: var(--fg);
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .inline {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.2rem;
  }

  @media (max-width: 40rem) {
    .skills { grid-template-columns: 1fr; gap: 0.15rem 0; }
    .skills dt { margin-top: 0.6rem; }
  }
</style>

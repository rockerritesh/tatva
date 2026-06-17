---
layout: default
title: About
permalink: /about/
---

<img src="https://sumityadav.com.np/rockerritesh.png" alt="Sumit Yadav"> <style>
        img{
        display: block;
        margin-left: auto;
        margin-right: auto;
        border-radius: 80%;
        text-align:center;
        width:40%
        }
</style>

# Sumit Yadav

**Interpretability & AI-safety research**
*Computer Engineering · Pulchowk Campus, Tribhuvan University, Nepal*

[Email](mailto:076bct088.sumit@pcampus.edu.np) ·
[Google Scholar](https://scholar.google.com/citations?user=ag74ytsAAAAJ&hl=en) ·
[GitHub](https://github.com/rockerritesh) ·
[LinkedIn](https://www.linkedin.com/in/rockerritesh/) ·
[CV](https://sumityadav.com.np/cv.pdf) ·
[Portfolio](https://sumityadav.com.np)

---

I'm a Computer Engineering student at **Pulchowk Campus, Tribhuvan University**. Most of my time goes
into trying to understand how language models work on the inside — why a safety-aligned model sometimes
refuses perfectly harmless questions, and how the **geometry of a model's internal representations**
relates to what it has actually learned. A lot of it is simply curiosity, following a question until it
starts to make sense.

I care about making these tools useful for languages that are often left out. My family speaks
**Maithili** — around 50 million speakers, yet very little language technology exists for it — so
building a small model for it felt as personal as it was technical.

Alongside research I work on AI safety and agentic systems at **[Astha.ai](https://astha.ai)**, and I
hope to pursue a PhD in interpretability and alignment. I try to learn in the open: I write here on
Tatva, share short explainers on [YouTube](https://www.youtube.com/@Audio-Obsession), and keep a camera
and a fondness for Mithila's stories and festivals close by. If any of this overlaps with your own work,
I'd be glad to hear from you.

## Research Interests

- **Mechanistic interpretability** — representation trajectories, activation steering, circuits
- **AI alignment & safety** — over-refusals, safe deployment, agentic oversight
- **Representation geometry** — effective dimension, generalization, distribution shift
- **Low-resource & multilingual NLP** — building models and benchmarks for underrepresented languages
- **Agentic systems security** — prompt injection, tool poisoning, Model Context Protocol (MCP)

## Selected Publications

See my [Google Scholar](https://scholar.google.com/citations?user=ag74ytsAAAAJ&hl=en) for the full list.

1. **SafeConstellations: Mitigating Over-Refusals in LLMs Through Task-Aware Representation Steering.**
   *ACL 2026 (Main Conference).* An inference-time, task-aware trajectory-shifting method that cuts
   over-refusals by up to **73%** with minimal utility loss — no retraining required.
   [[paper]](https://arxiv.org/abs/2508.11290)

2. **On the Relationship Between Representation Geometry and Generalization in Deep Neural Networks.**
   *Preprint, 2026 (sole author).* Shows that **effective dimension** — an unsupervised geometric metric —
   predicts generalization across vision and language models (partial *r* = 0.75 over 52 classifiers).
   [[paper]](https://arxiv.org/abs/2602.00130)

3. **Geometric Phases of Mechanism Formation in Neural Networks.**
   *GLOW 2026 — Workshop on Generalizing from Limited Resources in the Open World @ IJCAI 2026 (Poster).*
   Using linear probes and centered kernel alignment (CKA) across dense training checkpoints, finds that
   classification mechanisms form **output-layer-first** and within the **first ~5% of training**: output
   layers reach >70% probe accuracy by epoch 5 while input layers stay below 50% (Cohen's *d* = 3.68). The
   same deep-first pattern holds in the first ~200M tokens of from-scratch LLM pretraining (GPT-2 Small,
   SmolLM2-135M) and reproduces on public Pythia / OLMo-2 checkpoints — and isn't explained by gradient
   magnitude (input layers receive up to 6.9× more gradient yet learn less). A temporal map of *when* and
   *where* mechanisms emerge (CIFAR-10/100, decoder-only LLMs). *arXiv & code coming soon.*

4. **Can maiBERT Speak for Maithili?**
   *LoResLM @ ACL 2026.* The first monolingual BERT for Maithili (~50M speakers); **87% accuracy**
   on news classification, outperforming MuRIL and NepBERTa.
   [[paper]](https://arxiv.org/abs/2509.15048) · [[model]](https://huggingface.co/rockerritesh/maiBERT_TF)

5. **Revolutionizing Currency Security: A YOLOv8-Based Approach for Detecting Counterfeit Nepali Banknotes.**
   *J. Bus. Econ. Stud., 2024.* [[paper]](https://doi.org/10.61440/JBES.2024.v1.47)

6. **Machine Learning Analysis of Tirhuta Lipi.**
   *2023.* 0.97 accuracy in Tirhuta script recognition for OCR and translation of low-resource scripts.
   [[paper]](https://www.researchgate.net/publication/373370042_Machine_Learning_Analysis_of_Tirhuta_Lipi)

7. **Support Vectors Are a Better Way of Text Classification for Imbalanced Data.**
   *2023.* A robust SVC method for 100+ class text classification under severe imbalance.
   [[paper]](https://www.researchgate.net/publication/371514138_SUPPORT_VECTORS_ARE_A_BETTER_WAY_OF_TEXT_CLASSIFICATION_FOR_IMBALANCED_DATA)

## Preprints & Work in Progress

- **Cross-lingual inference-time steering** ([devanagari-steering](https://github.com/rockerritesh/devanagari-steering)) —
  transferring a model's Hindi competence onto sister Devanagari languages (Maithili, Nepali, Bhojpuri) with
  *no fine-tuning*, directly extending **SafeConstellations** and **maiBERT**.
- **Federated memory for AI agents** ([paper](https://github.com/rockerritesh/federated-memory-paper) ·
  [server](https://github.com/rockerritesh/sumit-mcp-server)) — long-term agent memory with transaction trails,
  versioning, and audit; evaluated on LOCOMO and LongMemEval.

## News

- **2026** — *Geometric Phases of Mechanism Formation in Neural Networks* accepted as a **poster at GLOW 2026 @ IJCAI**.
- **2026** — *SafeConstellations* accepted to **ACL 2026 (Main)**.
- **2026** — *maiBERT* accepted to **LoResLM @ ACL 2026**.
- **2026** — Preprint on **representation geometry and generalization** released.
- **2024–** — Working on AI-safety & agentic-systems research at **Astha.ai** (MCP-Scanner, SAFE-MCP).

## Experience

- **AI Researcher — Safety & Agentic Systems**, [Astha.ai](https://astha.ai) *(2025–present)* — Zero-Trust
  agent oversight, MCP-Scanner vulnerability platform, SAFE-MCP framework.
- **AI Engineer — RAG & Infrastructure**, AMNIL Technologies *(2024–2025)* — guardrails, LLM-as-a-Judge
  evaluation, self-hosted LLM serving with vLLM.
- **Data Team Lead**, GradeUp Educations *(2022–2024)* — learning agents/chatbots for students, an automated
  grade-evaluation system, and semantic-similarity matching between questions and answers.
- **GAN Specialization Mentor**, [DeepLearning.AI](https://www.deeplearning.ai/) *(2021–present)*.

## Selected Projects

- **[maiBERT](https://huggingface.co/rockerritesh/maiBERT_TF)** — first BERT for Maithili ([demo](https://maithili.streamlit.app/)).
- **[SAFE-MCP](https://github.com/rockerritesh)** — adversarial evaluation framework for MCP agent infrastructure.
- **[AgentGuard](https://github.com/rockerritesh/agentguard)** — Zero-Trust protocol for AI agents: identity, policy, mTLS, audit (Python SDK + Go server).
- **[spiffe-core](https://github.com/rockerritesh/spiffe-core)** · **[TraT](https://github.com/rockerritesh/trat-multi-agent)** — SPIFFE-based agent identity / attestation and Transaction Tokens for multi-agent workflows.
- **[sumit-mcp-server](https://github.com/rockerritesh/sumit-mcp-server)** — federated memory MCP server ([live on HF Spaces](https://huggingface.co/spaces/rockerritesh/sumit-server)).
- **[Vibe-Coder](https://github.com/rockerritesh/vibe_coder)** — an agent that builds Streamlit/FastAPI apps.
- **[IRB Robotics Arm](https://github.com/jarp0l/IRB-Robo-Arm)** — open-source image-recognition robotic arm (UN SDG3).

## Competitions

Active Kaggle competitor — recent: **ARC-AGI / NeuroGolf 2026** (minimal-cost ONNX networks),
**BirdCLEF 2026**, and **Scientific Image Forgery Detection** (SAM-based).

## Honors & Awards

- **Winner, GritFeat AI Hackathon** (2023) — *SWIFT*: wearable LSTM fall-detection for the elderly (79.86%).
- **1st Runner-Up, Locus Dataverse** (2023) — NLP classification of imbalanced research-paper abstracts.
- **1st Runner-Up, Docsumo DataRush** (2022) — abstract classification into 158 classes (SVC + TF-IDF).
- **Best AI Project, DELTA 3.0** (2023) — *Nepali Harvest*: crop-disease prediction & harvest-time recommendations.
- **Winner, IT-Meet Image Challenge** (2022) — computer-vision classification of Nepali ballot-paper images.
- **Winner, LogPoint Capture The Flag** (2022) — binary exploitation & forensics.

## Contact

**Academic:** [076bct088.sumit@pcampus.edu.np](mailto:076bct088.sumit@pcampus.edu.np)
**Personal:** [rockerritesh4@gmail.com](mailto:rockerritesh4@gmail.com) · +977-9819856148
Kathmandu, Nepal

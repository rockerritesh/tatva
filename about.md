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

**AI Safety & Interpretability Researcher**
*Computer Engineering · Pulchowk Campus, Tribhuvan University, Nepal*

[Email](mailto:076bct088.sumit@pcampus.edu.np) ·
[Google Scholar](https://scholar.google.com/citations?user=ag74ytsAAAAJ&hl=en) ·
[GitHub](https://github.com/rockerritesh) ·
[LinkedIn](https://www.linkedin.com/in/rockerritesh/) ·
[CV](https://sumityadav.com.np/cv.pdf) ·
[Portfolio](https://sumityadav.com.np)

---

I am a Computer Engineering student at **Pulchowk Campus, Tribhuvan University**, working on the
**interpretability and safety of language models**. My research looks at how safety-aligned LLMs
fail silently — through over-refusals, geometric misrepresentation, and surface-level triggers —
and how the internal structure of a model's representations can be understood and steered to make
it safer and more reliable.

A recurring theme in my work is **geometry**: representations trace structured trajectories inside a
model, and that structure turns out to predict both *safety behavior* and *generalization*. I am
equally invested in extending these tools to **low-resource and multilingual settings**, where I
built the first language model for Maithili (~50M speakers).

I currently lead AI-safety and agentic-systems research at **[Astha.ai](https://astha.ai)**, and I am
**ready to begin a PhD (Fall 2027)** in mechanistic interpretability and AI alignment — actively
looking for the right group to join.

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
   *Working paper, 2026.* Traces how internal mechanisms form across training using linear probes,
   CKA, and targeted ablations (CIFAR-10/100).

3. **Can maiBERT Speak for Maithili?**
   *LoResLM @ ACL 2026.* The first monolingual BERT for Maithili (~50M speakers); **87% accuracy**
   on news classification, outperforming MuRIL and NepBERTa.
   [[paper]](https://arxiv.org/abs/2509.15048) · [[model]](https://huggingface.co/rockerritesh/maiBERT_TF)

4. **Revolutionizing Currency Security: A YOLOv8-Based Approach for Detecting Counterfeit Nepali Banknotes.**
   *J. Bus. Econ. Stud., 2024.* [[paper]](https://doi.org/10.61440/JBES.2024.v1.47)

5. **Machine Learning Analysis of Tirhuta Lipi.**
   *2023.* 0.97 accuracy in Tirhuta script recognition for OCR and translation of low-resource scripts.
   [[paper]](https://www.researchgate.net/publication/373370042_Machine_Learning_Analysis_of_Tirhuta_Lipi)

6. **Support Vectors Are a Better Way of Text Classification for Imbalanced Data.**
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

- **2026** — *SafeConstellations* accepted to **ACL 2026 (Main)**.
- **2026** — *maiBERT* accepted to **LoResLM @ ACL 2026**.
- **2026** — Preprint on **representation geometry and generalization** released.
- **2024–** — Leading AI-safety & agentic-systems research at **Astha.ai** (MCP-Scanner, SAFE-MCP).

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

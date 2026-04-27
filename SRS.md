# Software Requirements Specification (SRS)
## 1. Introduction
### 1.1 Purpose
The purpose of this document is to outline the requirements and specifications for the **AutoProjectEval** system. AutoProjectEval is an AI-powered evaluation tool that rigorously audits GitHub projects. It simulates a rigorous technical review by a Senior Staff Software Engineer, providing users with actionable, enterprise-level feedback.

### 1.2 Scope
AutoProjectEval accepts a GitHub repository URL and a brief user description. It fetches project metadata (like the README and technology stack) using the GitHub API, and evaluates the project using a Large Language Model (Groq Llama 3.3 70B). The output provides a critical evaluation score, an overall quality assessment, recognized strengths, and strict technical improvements.

---

## 2. Overall Description
### 2.1 Product Perspective
The system operates as a distributed web application consisting of two primary components:
1. **Frontend**: A React-based web interface built using Vite, TailwindCSS, Framer Motion, and Recharts, providing a sleek and interactive user experience.
2. **Backend**: A Python Flask RESTful API that handles data gathering and AI interactions via the Groq API.

### 2.2 Product Features
* **GitHub Integration**: Automatically extracts repository details, technology stack, and README content using the GitHub API.
* **AI Evaluation Engine**: Utilizes the Llama 3.3 70B model via Groq API, instructed to behave as a strict Senior Software Engineer.
* **Scoring System**: Generates an overall score (0-100) and assigns a quality tag (e.g., Production-Ready 🚀, Needs Refactoring 🛠️).
* **Feedback Generation**: Identifies structural strengths and proposes critical, demanding improvements (e.g., automated testing, Docker containerization, security practices).
* **Interactive UI**: Presents the evaluation results via an engaging dashboard using Recharts for data visualization and Framer Motion for animations.

### 2.3 User Classes and Characteristics
* **Developers/Students**: The primary users who submit their GitHub portfolio projects to receive honest, technical criticism to improve their codebase.
* **Reviewers/Mentors**: Secondary users who might use the tool as a baseline for providing code review feedback.

---

## 3. System Architecture & Technologies
### 3.1 Frontend Stack
* **Framework**: React 19 (via Vite)
* **Styling**: Tailwind CSS, PostCSS
* **Icons**: Lucide React
* **Animations**: Framer Motion
* **Data Visualization**: Recharts

### 3.2 Backend Stack
* **Framework**: Python 3, Flask
* **API Communication**: `requests` library for GitHub API, `flask-cors` for cross-origin requests.
* **AI Integration**: Groq API (`llama-3.3-70b-versatile`)
* **Environment Management**: `dotenv` for managing sensitive keys (e.g., `GROQ_API_KEY`).

---

## 4. Functional Requirements
* **FR1**: The system must accept a GitHub URL and a project description via a RESTful API POST request (`/evaluate`).
* **FR2**: The backend must extract the repository owner and name from the provided URL.
* **FR3**: The backend must query the GitHub API to fetch repository metadata, languages used, and README content.
* **FR4**: The system must truncate the README content to 4000 characters to prevent context limit errors in the LLM.
* **FR5**: The backend must submit the gathered data to the Groq API with a predefined system prompt to ensure strict evaluation constraints.
* **FR6**: The AI response must be enforced in pure JSON format containing `score`, `quality`, `strengths`, and `improvements`.
* **FR7**: The frontend must display the JSON response in a user-friendly, animated dashboard layout.
* **FR8**: If the repository is private or not found, the system must return a clear error message.

---

## 5. Non-Functional Requirements
* **Performance**: The evaluation should be fast, heavily relying on Groq's high-speed inference capabilities.
* **Security**: The backend must secure API keys using environment variables and avoid exposing the Groq API key to the frontend.
* **Reliability**: The system must handle GitHub API rate limits or missing READMEs gracefully.
* **Usability**: The frontend should be responsive and provide clear visual feedback during loading and processing states.

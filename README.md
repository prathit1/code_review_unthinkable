## 🎥 Demo Video

You can watch the demo of this project here:  
[👉 Click to Watch on Google Drive](https://drive.google.com/file/d/1SUXIw69IT19MAXnoxIuTWFyFIg9c3YnT/view?usp=sharing)





# 🧠 Code Review Assistant

## 📋 Project Overview
**Code Review Assistant** is an AI-powered tool designed to **automate code reviews** by analyzing source code for **readability**, **structure**, **modularity**, and **best practices**.  
It uses a **Large Language Model (LLM)** to generate detailed review reports and improvement suggestions for uploaded code files.

---

## 🎯 Objective
The main goal of this project is to **streamline the code review process** using AI assistance — helping developers identify bugs, improve code quality, and follow best practices efficiently.

---

## ⚙️ Features
- 📤 Upload and analyze any source code file
- 🤖 AI-based code review using LLM (OpenAI / Gemini)
- 📋 Automatically generated improvement report
- 💾 Optional database integration to store past reviews
- 🌐 RESTful API endpoints for code review automation
- 📈 Optional dashboard for uploading and viewing reports

---

## 🧱 System Architecture

**1. User Input:**  
The user uploads a code file (e.g., Python, JavaScript, etc.) through an API or dashboard.

**2. Backend Processing:**  
The backend reads the code and sends it to an **LLM API** with a structured prompt for analysis.

**3. LLM Analysis:**  
The AI model reviews the code for readability, modularity, and potential bugs, and returns improvement suggestions.

**4. Output Generation:**  
The backend formats the model’s response into a readable **review report** and returns it to the user.

---

## 🧰 Tech Stack

| Component | Technology Used |
|------------|------------------|
| **Backend** | Node.js + Express |
| **Frontend (Optional)** | React.js |
| **Database (Optional)** | MongoDB / SQLite |
| **AI Integration** | OpenAI / Gemini API |
| **Version Control** | Git & GitHub |
| **Deployment (Optional)** | Render / Vercel / Localhost |

---

## 🧩 API Endpoints

### **POST /api/review**
Uploads and analyzes a source code file.

#### **Request:**
```bash
POST /api/review
Content-Type: multipart/form-data
Body:
{
  "file": <uploaded_code_file>
}
```

#### **Response:**
```json
{
  "status": "success",
  "review": {
    "readability": "Good variable naming but inconsistent indentation.",
    "structure": "Functions can be modularized better.",
    "bugs": "Potential null reference on line 45.",
    "suggestions": "Add docstrings and follow PEP8 style."
  }
}
```

---

## 🧠 LLM Prompt Example
```text
Review this code for readability, modularity, and potential bugs.
Then provide improvement suggestions in bullet points.
```

This prompt ensures that the LLM consistently provides focused and meaningful insights.

---

## 🚀 How to Run Locally

### **1. Clone the Repository**
```bash
git clone https://github.com/prathit1/code_review_unthinkable.git
cd code_review_unthinkable
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Environment Variables**
Create a `.env` file in the project root and add:
```bash
OPENAI_API_KEY=your_api_key_here
```

### **4. Start the Server**
```bash
npm start
```

### **5. Test the API**
Use Postman or Curl to send a POST request to:
```
http://localhost:5000/api/review
```

---

## 🧾 Example Output
After uploading a code file, the assistant returns a structured review report, highlighting:
- Code readability issues
- Poor modular structure
- Potential bugs
- Clear improvement recommendations

---

## 🧭 Evaluation Focus
- 🔍 Quality of LLM insights and accuracy
- ⚙️ Backend API design and modularity
- 🧱 Code handling efficiency
- 🧩 Completeness and scalability of the system

---

## 🛠️ Future Enhancements
- Add a **web dashboard** for real-time code review and report visualization  
- Enable **multi-language code review support**  
- Integrate with **GitHub Actions** or **CI/CD pipelines** for continuous code reviews  
- Improve report formatting with syntax highlighting  

---

## 🧑‍💻 Author
**Prathit Singh**  
📎 [GitHub: prathit1](https://github.com/prathit1)  
💼 Project: *Code Review Assistant - Unthinkable Challenge 2025*

---

## 🏁 Conclusion
**Code Review Assistant** bridges the gap between human and automated code reviews.  
By leveraging AI through LLMs, it helps developers maintain clean, optimized, and readable code — saving time and improving code quality across projects.

---

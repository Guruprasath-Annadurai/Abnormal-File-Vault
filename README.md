# 🗄️ Abnormal File Vault – Secure File Management System

A full-stack file vault application built using **Django** (backend) and **React + TailwindCSS** (frontend). This project features secure file upload, download, duplicate detection, search, and admin control – all containerized with **Docker**.

---

## 🚀 Features

- 📁 Upload, list, preview, and delete files
- 🔐 File deduplication via SHA-256
- ❌ Alert for duplicate file uploads
- 🔎 Real-time file search by name
- 🧩 File type icons (.csv, .json, .yaml, etc.)
- 📦 Backend API with Django Rest Framework
- 🌐 Responsive UI with TailwindCSS
- 🐳 Docker Compose support for easy deployment

---

## 🛠️ Tech Stack

| Layer        | Tech                         |
|--------------|------------------------------|
| Frontend     | React, TailwindCSS           |
| Backend      | Django, Django Rest Framework|
| Styling      | TailwindCSS                  |
| Deployment   | Docker, Docker Compose       |
| Extras       | CORS support, SQLite DB      |

---

## 📸 Demo Preview

> A recruiter-friendly walkthrough showing upload, delete, error alerts, search filtering, and styling polish.

---

## 🧪 Run Locally

1. Clone the repository  
   `git clone https://github.com/Guruprasath-Annadurai/Abnormal-File-Vault.git`

2. Start Docker  
   `docker-compose up --build`

3. Access the app at:  
   `http://localhost:3000`

4. API Docs (optional):  
   `http://localhost:8000/api/files/`

---

## 👨‍💻 Author

**Guruprasath Annadurai**  
🌐 [LinkedIn](https://linkedin.com/in/guruprasath-annadurai)  
📧 annaduraiguruprasath7@gmail.com

---

## 📄 License

MIT License

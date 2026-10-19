# 🚨 Scammer Radar

Scammer Radar is a full-stack web application designed to help users identify, report, and expose online scammers and fraudulent activities. Users can search for suspicious entities using credentials such as **Phone Numbers**, **PayPal Accounts**, or review uploaded **Screenshots/Evidence**.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, HTML5
- **Backend:** Python, Django, Django REST Framework (DRF)
- **Database:** PostgreSQL
- **Version Control:** Git & GitHub

---

## ✨ Features

- **Search & Verification:** Look up scammers via Phone numbers or PayPal IDs to check fraud history.
- **Evidence Upload:** Upload screenshots and proof to expose fraudulent transactions or profiles.
- **Report System:** Community-driven reporting to flag new scams.
- **Secure Backend:** Protected endpoints with JWT authentication and environment-based configuration (`.env`).

---

## 🚀 Project Structure

```text
Scammer-Radar/
│
├── Frontend/          # React.js client application
│   ├── src/
│   └── package.json
│
├── Backend/           # Django REST API
│   ├── scammer_api/   # Main Django app
│   ├── manage.py
│   └── requirements.txt
│
└── .gitignore         # Ignored files (venv, node_modules, .env)

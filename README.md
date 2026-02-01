# HRMS Lite

A lightweight Human Resource Management System (HRMS) built with React, Vite, Tailwind CSS, FastAPI, and SQLModel.

## Features

- **Employee Management**: Add, view, and delete employees.
- **Attendance Management**: Mark daily attendance, view attendance records , filter attendance record by date and view total present days per employee record.
- **Modern UI**: Clean, responsive interface using Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, Lucide React, React Router DOM
- **Backend**: FastAPI, SQLModel, Uvicorn, SQLite
- **Deployment Ready**: Configured for Vercel (Frontend) and Render (Backend)

## Prerequisites

- Node.js (v18+)
- Python (v3.10+)

## Installation & Running Locally

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment (optional but recommended):

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
API Documentation (Swagger UI) is available at `http://localhost:8000/docs`.

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Deployment

### Frontend (Vercel)

`https://hr-management-system-orpin-theta.vercel.app/`

### Backend (Render)

API Documentation `https://hr-management-system-qkz6.onrender.com/docs`


## Project Structure

```
HRMS-Lite/
├── backend/
│   ├── database.py    # Database connection
│   ├── main.py        # API endpoints
│   ├── models.py      # Database models
│   ├── requirements.txt
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── README.md
```

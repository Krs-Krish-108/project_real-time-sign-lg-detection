# Real-Time Sign Language Detection (RTDM)

A monorepo containing the **frontend** (React/Vite → Vercel) and **backend** (FastAPI/Python → Render).

```
rtdm/
├── frontend/    ← React + Vite app (deployed to Vercel)
└── backend/     ← FastAPI Python app (deployed to Render)
```

---

## 🚀 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # defaults to http://localhost:8000
npm run dev
```

---

## ☁️ Deployment

### Backend → Render
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect this repo, set **Root Directory** to `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add **Environment Variable:** `ALLOWED_ORIGINS` = `https://your-app.vercel.app`
6. Copy the Render service URL (e.g. `https://rtdm-backend.onrender.com`)

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Connect this repo, set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add **Environment Variable:** `VITE_API_URL` = `https://rtdm-backend.onrender.com`
5. Deploy!

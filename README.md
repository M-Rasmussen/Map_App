# Map Demo

Transit stops demo with a Flask backend and Vite/React frontend.

## Security Before Uploading

- Do not commit real `.env` files. They are ignored by `.gitignore`.
- Put local values in `frontend/.env` and `backend/.env`.
- Use `frontend/.env.example` and `backend/.env.example` as templates.
- The browser map does not use a Mapbox token. It uses public OpenStreetMap raster tiles through the existing map renderer.
- If a real private API key is added later, keep it only in the backend environment and call it from Flask. Never expose private keys through `VITE_` variables.

## Run Locally

Backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

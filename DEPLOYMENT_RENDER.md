# Village Water System - Render Deployment Guide

Follow these steps to deploy your project to **Render** using an **Aiven** MySQL database.

---

## Step 1: Set up Aiven MySQL
1. Go to [Aiven.io](https://aiven.io/) and get your **Service URI**.
2. Click the **Copy icon** next to **Service URI**. It looks like `mysql://avnadmin:password@host...`.

---

## Step 2: Deploy the Backend (Automatic)
1. Go to [Render.com](https://render.com/), click **"New +"** -> **"Blueprint"**.
2. Connect your repo: `Alain296/VillageWaterSystem`.
3. Give it a name and click **"Apply"**.
4. When it asks for `DATABASE_URL`, paste your **Aiven Service URI**.

---

## Step 3: Deploy the Frontend (Manual)
*We do this manually to avoid configuration errors.*

1. In the Render dashboard, click **"New +"** -> **"Static Site"**.
2. Connect your GitHub repository.
3. **Name**: `village-water-frontend`.
4. **Build Command**: `cd frontend && npm install && npm run build`.
5. **Publish Directory**: `frontend/build`.
6. Click **"Add Environment Variable"**:
   * **Key**: `REACT_APP_API_URL`
   * **Value**: Your backend URL + `/api` (e.g., `https://village-water-backend.onrender.com/api`).
7. Click **"Create Static Site"**.

---

## Step 4: Initialize Data
1. Once the backend is live, go to its **"Shell"** tab in Render.
2. Run:
   ```bash
   cd backend
   python manage.py migrate
   ```

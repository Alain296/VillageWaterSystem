# Village Water System - Render Deployment Guide

Follow these steps to deploy your project to **Render** using an **Aiven** MySQL database.

---

## Step 1: Set up Aiven MySQL (Free Database)

1.  Go to [Aiven.io](https://aiven.io/) and create a free account.
2.  Click **"Create service"**.
3.  Select **MySQL**.
4.  Choose the **"Free"** plan (available in certain regions like AWS Frankfurt or Google Cloud Iowa).
5.  Give it a name like `village-water-db`.
6.  Once the service is "Running", look for the **Service URI** or **Connection String**.
    *   It will look like: `mysql://user:password@host:port/defaultdb?ssl-mode=REQUIRED`
    *   **Keep this URI safe!** We will use it in Render.

---

## Step 2: Deploy to Render

1.  Log in to [Render.com](https://render.com/) and connect your GitHub account.
2.  Click **"New +"** (top right) and select **"Blueprint"**.
3.  Connect your repository: `Alain296/VillageWaterSystem`.
4.  Render will automatically find the `render.yaml` file I created.
5.  Click **"Apply"**.

### Configuration during "Apply":

Render will ask you to fill in some environment variables:

#### For `village-water-backend`:
*   **DATABASE_URL**: Paste your **Service URI** from Aiven here.
    *   *Note*: Django needs the scheme to be `mysql://`. If Aiven gives you a different URI, ensure it starts with `mysql://`.
*   **SECRET_KEY**: Render will generate one automatically if you leave it or you can provide one.

#### For `village-water-frontend`:
*   **REACT_APP_API_URL**: Once the backend service starts, Render will give it a URL (e.g., `https://village-water-backend.onrender.com`).
*   Paste that URL followed by `/api` here.
    *   Example: `https://village-water-backend.onrender.com/api`

---

## Step 3: Initialize the Database

Once the backend service is "Live" on Render:

1.  Go to the **"Shell"** tab of your `village-water-backend` service in Render.
2.  Run the following commands to create your user accounts and initial data:
    ```bash
    cd backend
    python manage.py migrate
    python manage.py shell
    ```
3.  Inside the Python shell, you can run:
    ```python
    from api.models import User
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    exit()
    ```

---

## Step 4: Access your Site

Your frontend will be available at the URL provided by the `village-water-frontend` service.
Example: `https://village-water-frontend.onrender.com`

> [!TIP]
> **Static Files**: If images or styles don't load, check the Render logs for "collectstatic" errors. I've configured WhiteNoise to handle this automatically.

> [!WARNING]
> **Aiven SSL**: If you get an SSL error when connecting to Aiven, you might need to append `?ssl-mode=REQUIRED` (or similar) to your `DATABASE_URL`.

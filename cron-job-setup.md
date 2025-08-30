# Supabase Keep-Alive: Simple &amp; Professional Cron Job Setup

## The Challenge: Project Pausing on Supabase's Free Tier

Supabase's free tier is an excellent resource, but to manage resources, projects that are inactive for 7 consecutive days are automatically paused. This causes application downtime until you manually restart it.

To ensure your application is always online, we need to generate activity at least once a day. This guide provides two methods to do this using a **cron job**—an automated, scheduled task.

1.  **Simple Method (Recommended):** Uses a free web service. It's fast, easy, and requires no code.
2.  **Advanced Method:** Uses GitHub Actions. It's more integrated but requires more setup.

---

## 1. Simple Method (Recommended): Using a Web-Based Cron Service

This is the fastest and easiest way to keep your project active. We'll use a free service called **cron-job.org** to "ping" our database once a day.

### Step 1: Get Your Supabase API URL and Key

First, we need two pieces of information from your Supabase project dashboard.

1.  Navigate to your project on [Supabase](https://supabase.com).
2.  Go to **Settings** (the gear icon in the left sidebar).
3.  Click on **API**.
4.  Find the following:
    *   **Project URL:** Copy this URL. It will look like `https://<your-project-id>.supabase.co`.
    *   **Project API Keys:** Copy the `anon` (public) key. **Do not use the `service_role` key.** The `anon` key is safe to use here as it's designed for public, client-side access.

### Step 2: Construct the Full Request URL

Now, combine your Project URL with a simple query. This query is designed to be extremely lightweight—it just asks for the ID of a single campaign.

Replace `[YOUR_SUPABASE_URL]` in the template below with the URL you copied.

**URL Template:**
`[YOUR_SUPABASE_URL]/rest/v1/campaigns?select=id&limit=1`

**Example:**
`https://oduqbidlonpeysuwtgtx.supabase.co/rest/v1/campaigns?select=id&limit=1`

### Step 3: Configure cron-job.org

1.  Go to [https://cron-job.org/](https://cron-job.org/) and click **"CREATE CRONJOB"**.
2.  Fill out the form:
    *   **Title:** `Supabase Keep-Alive` (or any name you prefer).
    *   **URL:** Paste the full request URL you constructed in Step 2.
    *   **Schedule:** Select **"Every day"**. You can leave the time as it is.
3.  **Add Authentication Headers:**
    *   Scroll down and click on the **"Show advanced options"** toggle.
    *   Under **"Custom HTTP headers"**, click **"Add header"**.
    *   Enter the following:
        *   **Name:** `apikey`
        *   **Value:** Paste your `anon` (public) key here.
    *   Click **"Add header"** again.
    *   Enter the following:
        *   **Name:** `Authorization`
        *   **Value:** `Bearer ` followed by your `anon` (public) key. (e.g., `Bearer eyJhbGciOi...`)
4.  Click the **"CREATE"** button.

That's it! The cron job is now active. You can test it by clicking the "play" icon (▶) in your cron-job.org dashboard to run it manually and check the history.

---

## 2. Advanced Method: GitHub Actions Workflow

This method is for users who prefer to have the configuration live directly within their project's repository.

### Step 1: Create the Workflow File

1.  In your project's root, create a folder named `.github`, and inside it, another folder named `workflows`.
2.  Inside `workflows`, create a file named `supabase-keep-alive.yml`.

The final path should be: `.github/workflows/supabase-keep-alive.yml`

### Step 2: Add the Workflow Configuration

Copy the following YAML configuration into your `supabase-keep-alive.yml` file.

```yaml
# .github/workflows/supabase-keep-alive.yml

name: Supabase Keep-Alive

on:
  schedule:
    # Runs the job every day at 10:30 AM UTC.
    - cron: '30 10 * * *'
  workflow_dispatch:
    # Allows you to run this workflow manually from the Actions tab for testing.

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Ping Supabase Database to Keep Project Active
        run: |
          # This command sends a lightweight, read-only GET request.
          # The --fail flag ensures the job fails if the API returns a non-2xx status code.
          curl --request GET \
            --url "${{ secrets.SUPABASE_URL }}/rest/v1/campaigns?select=id&limit=1" \
            --header "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            --header "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            --fail
```

### Step 3: Configure Secure GitHub Secrets

1.  Go to your project's GitHub repository and click the **Settings** tab.
2.  Navigate to **Secrets and variables** > **Actions**.
3.  Click **New repository secret** to create the following two secrets:
    *   **`SUPABASE_URL`**: Your full Supabase project URL.
    *   **`SUPABASE_ANON_KEY`**: Your Supabase `anon` (public) key.

### Step 4: Commit and Push

Commit the `.github/workflows/supabase-keep-alive.yml` file and push it to your repository. The workflow is now active and will run on its defined schedule. You can monitor it under the **Actions** tab of your repository.

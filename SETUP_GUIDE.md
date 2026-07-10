# Dhiblawe Trading — Setup Guide

This is the website for Dhiblawe Trading (meat, fruits & vegetables, dry food,
and milk supply), ready to deploy to **dhiblawetrading.com** via Vercel.

## What's in this project

- `public/index.html` — the main marketing site (hero, about, products, why us, contact form)
- `public/admin/login.html` + `public/admin/dashboard.html` — password-protected page to view quote/contact requests
- `api/contact.js` — saves contact form submissions to a Vercel database (KV)
- `api/admin-login.js`, `api/admin-check.js`, `api/admin-logout.js` — admin login session (secure cookie)
- `api/admin-inquiries.js` — returns saved inquiries to the admin dashboard
- `vercel.json`, `package.json` — hosting + dependency configuration

## Step 1 — Deploy to Vercel

1. Go to **vercel.com** and sign in (you can use your GitHub account).
2. Click **Add New → Project**, and select the `dhiblawertrading` GitHub repository.
3. Vercel will auto-detect this as a Node project. Before clicking Deploy, add the
   environment variables below.

### Step 1a — Environment variables

In the Vercel project setup screen, under **Environment Variables**, add:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | Choose the password you'll use to view inquiries at `/admin` |
| `JWT_SECRET` | Any long random string (40+ characters) — secures the admin login session |

Click **Deploy**. Within a minute or two you'll get a live URL like `dhiblawertrading.vercel.app`.

## Step 2 — Add a database (Vercel KV) for the contact form

The contact form needs somewhere to store submissions.

1. In your Vercel project, go to the **Storage** tab.
2. Click **Create Database** and choose **KV** (or, if KV isn't shown, choose the
   **Upstash for Redis** option under Marketplace Database Providers — it works the same way).
3. Follow the prompts to create it, then **Connect** it to this project.
4. Vercel automatically adds the `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment
   variables for you — no manual copying needed.
5. Go to **Deployments** and **Redeploy** the project so it picks up the new database
   connection.

Once this is done, submissions from the contact form on the site will be saved, and
will appear on the admin dashboard.

## Step 3 — Connect your domain

1. In Vercel, go to your project → **Settings → Domains**.
2. Type `dhiblawetrading.com` (and optionally `www.dhiblawetrading.com`) and click **Add**.
3. Vercel will show DNS records (an A record and/or CNAME) to add wherever you
   bought the domain (GoDaddy, Namecheap, etc.).
4. Log into your domain registrar, open **DNS settings** for dhiblawetrading.com, and
   add the exact records Vercel showed you.
5. This can take a few minutes to a few hours to activate. Vercel's domain page shows
   a green checkmark once it's live.

## Step 4 — Use it

- **Main site:** `https://dhiblawetrading.com` — visitors can browse products and submit
  the contact/quote form.
- **Admin dashboard:** `https://dhiblawetrading.com/admin` — log in with the
  `ADMIN_PASSWORD` you set, to view every quote request that's come in.

## Editing content

- Phone number, email, and address placeholders are in `public/index.html` inside the
  `#contact` section (`Phone`, `Email`, `Location` rows) — replace them with your real
  details before going live.
- Product category text and lists are in the `#products` section of the same file.

## If something goes wrong

- **"Server not configured" on admin login** — you missed Step 1a. Go to Vercel →
  Settings → Environment Variables, confirm `ADMIN_PASSWORD` and `JWT_SECRET` are set,
  then redeploy.
- **Contact form says "Could not save your request"** — the database isn't connected
  yet. Complete Step 2, then redeploy.
- **Domain not connecting** — DNS changes can take time; double-check the records at
  your registrar exactly match what Vercel showed you.
- **Forgot the admin password** — go to Vercel → Settings → Environment Variables, edit
  `ADMIN_PASSWORD`, save, and redeploy.

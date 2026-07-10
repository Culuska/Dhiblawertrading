const { redis } = require("../lib/redis");

const LIST_KEY = "dhiblawe:inquiries";
const MAX_STORED = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLen) {
  return String(value || "").trim().slice(0, maxLen);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};

  // Honeypot: bots fill hidden fields humans never see. Pretend success, skip storage.
  if (clean(body.company_website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 2000);
  const business = clean(body.business, 150);
  const phone = clean(body.phone, 40);
  const interest = clean(body.interest, 60) || "Not specified";

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Name, email, and message are required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    business,
    phone,
    interest,
    message,
    createdAt: new Date().toISOString(),
  };

  if (!redis) {
    console.error("Redis not configured: missing KV_REST_API_URL/TOKEN env vars.");
    return res.status(500).json({ ok: false, error: "Could not save your request. Please try again later." });
  }

  try {
    await redis.lpush(LIST_KEY, JSON.stringify(record));
    await redis.ltrim(LIST_KEY, 0, MAX_STORED - 1);
  } catch (err) {
    console.error("Failed to store inquiry", err);
    return res.status(500).json({ ok: false, error: "Could not save your request. Please try again." });
  }

  return res.status(200).json({ ok: true });
};

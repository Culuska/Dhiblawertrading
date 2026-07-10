const { kv } = require("@vercel/kv");
const { verifySessionFromRequest } = require("../lib/auth");

const LIST_KEY = "dhiblawe:inquiries";

module.exports = async (req, res) => {
  if (!verifySessionFromRequest(req)) {
    return res.status(401).json({ ok: false, error: "Not authenticated" });
  }

  try {
    const raw = await kv.lrange(LIST_KEY, 0, -1);
    const inquiries = raw.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      }
      return item; // @vercel/kv may already return parsed objects
    }).filter(Boolean);

    return res.status(200).json({ ok: true, inquiries });
  } catch (err) {
    console.error("Failed to load inquiries", err);
    return res.status(500).json({ ok: false, error: "Could not load inquiries." });
  }
};

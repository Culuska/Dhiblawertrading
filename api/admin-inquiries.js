const { redis } = require("../lib/redis");
const { verifySessionFromRequest } = require("../lib/auth");

const LIST_KEY = "dhiblawe:inquiries";

module.exports = async (req, res) => {
  if (!verifySessionFromRequest(req)) {
    return res.status(401).json({ ok: false, error: "Not authenticated" });
  }

  if (!redis) {
    return res.status(500).json({ ok: false, error: "Database not configured." });
  }

  try {
    const raw = await redis.lrange(LIST_KEY, 0, -1);
    const inquiries = raw.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      }
      return item; // @upstash/redis may already return parsed objects
    }).filter(Boolean);

    return res.status(200).json({ ok: true, inquiries });
  } catch (err) {
    console.error("Failed to load inquiries", err);
    return res.status(500).json({ ok: false, error: "Could not load inquiries." });
  }
};

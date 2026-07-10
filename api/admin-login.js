const { signSession, setSessionCookie } = require("../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({ ok: false, error: "Server not configured. Set ADMIN_PASSWORD and JWT_SECRET." });
  }

  const { password } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: "Incorrect password." });
  }

  const token = signSession();
  setSessionCookie(res, token);
  return res.status(200).json({ ok: true });
};

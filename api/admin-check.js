const { verifySessionFromRequest } = require("../lib/auth");

module.exports = async (req, res) => {
  const authenticated = verifySessionFromRequest(req);
  return res.status(200).json({ authenticated });
};

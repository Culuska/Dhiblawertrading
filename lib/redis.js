const { Redis } = require("@upstash/redis");

// Supports either env var naming a Vercel Marketplace Redis integration may use.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

module.exports = { redis };

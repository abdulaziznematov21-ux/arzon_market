import { verifySmsHandler } from "./smsService.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Faqat POST so'rovi qabul qilinadi" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const result = await verifySmsHandler(body);
    return res.status(result.ok ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

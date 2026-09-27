// Vercel serverless function.
// Deployed at: POST /api/generate
// The Gemini key lives ONLY here, read from process.env — it is never sent to the browser.
// Set it in Vercel: Project → Settings → Environment Variables → GEMINI_API_KEY

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing 'prompt' in request body" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    res.status(500).json({
      error: "Server is missing GEMINI_API_KEY. Add it in Vercel → Settings → Environment Variables, then redeploy."
    });
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.65, maxOutputTokens: 12000 }
      })
    });

    const data = await r.json();

    if (!r.ok) {
      res.status(r.status).json({
        error: data?.error?.message || `Gemini request failed (${r.status})`
      });
      return;
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error calling Gemini" });
  }
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Missing input text" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: text
          }
        ],
      }),
    });

    const resultData = await response.json();

    // ✅ 印出完整 API 回傳內容（你可以到 Vercel Logs 查看）
    console.log("🔍 OpenAI 回傳結果：", JSON.stringify(resultData, null, 2));

    const result = resultData?.choices?.[0]?.message?.content?.trim() || "(No response)";
    return res.status(200).json({ result });

  } catch (err) {
    console.error("❌ Chat API 錯誤：", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

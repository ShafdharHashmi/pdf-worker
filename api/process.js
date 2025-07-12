import puppeteer from "puppeteer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pdfUrl } = req.body;
  if (!pdfUrl) {
    return res.status(400).json({ error: "Missing pdfUrl in request body" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(pdfUrl, { waitUntil: "networkidle0" });

    const content = await page.content();
    await browser.close();

    return res.status(200).json({ html: content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

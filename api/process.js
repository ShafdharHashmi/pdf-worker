// api/process.js

const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { pdfUrl } = req.body;

  if (!pdfUrl) {
    return res.status(400).json({ error: "Missing 'pdfUrl' in request body" });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(pdfUrl, { waitUntil: "networkidle2" });

    const html = await page.content();
    await browser.close();

    res.status(200).json({ html });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

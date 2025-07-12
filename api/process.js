import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { pdfUrl } = req.body;
    if (!pdfUrl) return res.status(400).json({ error: 'Missing pdfUrl' });

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(pdfUrl, { waitUntil: 'networkidle0' });

    const html = await page.content();
    await browser.close();

    return res.status(200).json({ html });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to process PDF' });
  }
}

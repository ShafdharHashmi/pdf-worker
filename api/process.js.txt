import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Only POST requests allowed');
    return;
  }

  const { pdfUrl } = req.body;
  if (!pdfUrl) {
    res.status(400).send('Missing pdfUrl');
    return;
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(pdfUrl, { waitUntil: 'networkidle0' });

  const html = await page.content();
  await browser.close();

  res.status(200).json({ html });
}

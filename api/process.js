import puppeteer from 'puppeteer';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Only POST requests allowed' }), {
      status: 405,
    });
  }

  const { pdfUrl } = await request.json();

  if (!pdfUrl) {
    return new Response(JSON.stringify({ error: 'Missing pdfUrl' }), {
      status: 400,
    });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(pdfUrl, { waitUntil: 'networkidle0' });

    const html = await page.content();
    await browser.close();

    return new Response(JSON.stringify({ html }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

import * as fs from 'fs';
import * as hds from 'handlebars';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

interface options {
  template: string;
  context: object;
  orientation?: string;
  pageFormat?: string;
  margin?: { top: string; right: string; bottom: string; left: string };
}

let page: puppeteer.Page;
const getPage = async () => {
  if (page) return page;
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security', // disabling CORS
      '--disable-site-isolation-trials',
      '--disable-notifications',
      '--no-zygote', // Seems to help avoid zombies https://github.com/puppeteer/puppeteer/issues/1825
    ],
  });
  page = await browser.newPage();
  return page;
};

export default async function (options: options): Promise<Buffer> {
  const templateFile = path.join(__dirname, `/../../../templates/pdfs/${options.template}.hbs`);

  // setup puppeteer page configs
  const pdfConfigs: any = { printBackground: true, preferCSSPageSize: true };

  if (options.orientation == 'p' || !options.orientation) {
    pdfConfigs.landscape = false;
  } else {
    pdfConfigs.landscape = true;
  }

  pdfConfigs.format = options.pageFormat ? options.pageFormat : 'A4';

  pdfConfigs.margin = options.margin
    ? options.margin
    : {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      };

  // render HDS
  const template = hds.compile(fs.readFileSync(templateFile, 'utf8'));
  const html = template(options.context);

  // start puppeteer
  const page = await getPage();

  // set html content
  await page.setContent(html, {
    waitUntil: 'domcontentloaded',
  });

  // make sure fonts have loaded before screenshot and pdf generation
  await page.evaluateHandle('document.fonts.ready');

  // reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

  // generate PDF with configs
  const buffer = await page.pdf(pdfConfigs);

  return Buffer.from(buffer);
}

import * as fn from 'firebase-functions';

export async function scrapeNewsByName = fn.https.onRequest(async (req, res) => {(
    person: Partial<Hostage>,
    lang: string = 'he',
  ): Promise<Partial<Hostage>[]> {
    const browser = await puppeteer.launch({ headless: false });
    const [page] = await browser.pages();
    await page.goto(`https://news.google.com/home?hl=${lang}`, {
      waitUntil: 'networkidle0',
    });
    const name = lang !== 'he' ? person.englishName : person.name;
    await page.type('[type="text"]', name);
    await page.keyboard.press('Enter');

    const data = await page.$$eval('article', (articles) => {
      return articles.map((article) => ({
        title: article.querySelector('h3 a')?.textContent,
        link: article.querySelector('a').href,
        time: article.querySelector('time')?.textContent,
        img: article.querySelector('img')?.src,
      }));
    });

    await page.close();
    await browser.close();
    res.send(data);    
  }
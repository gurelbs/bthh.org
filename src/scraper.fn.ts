export async function scrapeNewsByName = functions.https.onRequest(async (request, response) => {(
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
    response.send(data);    
  }
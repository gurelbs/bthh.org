const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

/**
 * Function to explore the links of a webpage
 * It returns 'Done'! as response
 */
exports.exploreLinks = functions.https.onRequest(async (request, response) => {
    
    // Remember that in Firebase you need to launch Puppeteer in headless mode and without sandbox
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    
    // Opening new page
    const page = await browser.newPage();
    
    // Going to a website and waiting until it's completely loaded (works for React pages too)
    await page.goto('https://erikmartinjordan.com', { waitUntil: 'networkidle0' });
    
    // Getting all the links on the webpage
    let pageLinks = await page.$$eval('a', links => links.map(link => link.href));
    
    // Closing the browser
    await browser.close();
    
    // Sending responsse
    response.send('Done!');    
    
});

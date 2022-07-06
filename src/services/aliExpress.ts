import pup from 'puppeteer';
import { page } from '../server';

export const getProductsAliExpress = async (search: string, index: number) => {
    let c = 1;

    const list = [];

    await page.goto('https://pt.aliexpress.com/',{waitUntil: 'load', timeout: 0});

    await page.waitForSelector('#search-key',{timeout: 0});

    await page.type('#search-key', search);

    await Promise.all([
        page.waitForNavigation({waitUntil: 'load', timeout: 0}),
        page.click('.search-button')
    ])

    const links = await page.$$eval('._3t7zg', el => el.map((link: any) => link.href));

    for (const link of links) {
        if (c === index + 1) continue;
        console.log('Ali '+c)
        await page.goto(link);
        await page.waitForSelector('.product-title-text', {timeout: 0});

        const image = await page.$eval('.magnifier-image', (el:any) => el.src)
        const title = await page.$eval('.product-title-text', (el: any) => el.innerText)
       
        const price = await page.evaluate(() => {
            const el: any = document.querySelector('.product-price-value');
            if (!el) return null;
            return el.innerText;
        });

        const seller = await page.evaluate(() => {
            const el: any = document.querySelector('.store-banner-title');
            if (!el) return null;
            return el.innerText;
        });
        
        if(price){
            const obj: any = {};
            (price ? obj.price = price : obj.price = null)
            
            obj.title = title;
            obj.price = price;
            (seller ? obj.seller = seller : '')
            obj.link = link;
            obj.image = image;
    
            list.push(obj);
    
            c++;
        }
        
    }

    return list;
}
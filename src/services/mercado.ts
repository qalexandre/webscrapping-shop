import pup from 'puppeteer';
import { page } from '../server';

export const getProductsMercado = async (search: string, index: number) => {
    let c = 1;

    const list = [];

    await page.goto('https://www.mercadolivre.com.br/',{waitUntil: 'load', timeout: 0});

    await page.waitForSelector('#cb1-edit',{timeout: 0});

    await page.type('#cb1-edit', search);

    await Promise.all([
        page.waitForNavigation({waitUntil: 'load', timeout: 0}),
        page.click('.nav-search-btn')
    ])

    const links = await page.$$eval('.ui-search-result__image > a', el => el.map((link: any) => link.href));

    for (const link of links) {
        if (c === index + 1) continue;
        console.log('Mercado '+c)
        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title',{timeout: 0});

        const image = await page.$eval('.ui-pdp-gallery__figure__image', (el:any) => el.src)
        const title = await page.$eval('.ui-pdp-title', (el: any) => el.innerText);
        const price = await page.$eval('.andes-money-amount__fraction', (el: any) => el.innerText);

        const seller = await page.evaluate(() => {
            const el: any = document.querySelector('.ui-pdp-seller__link-trigger');
            if (!el) return null;
            return el.innerText;
        });

        const obj: any = {};
        obj.title = title;
        obj.image = image;
        obj.price = 'R$' + price;
        (seller ? obj.seller = seller : '')
        obj.link = link;

        list.push(obj);

        c++;
    }


    return list;
}
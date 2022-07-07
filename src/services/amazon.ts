import pup from 'puppeteer';
import { io, page } from '../server';

export const getProductsAmazon = async (search: string, index: number) =>{
    let c = 1;

    const list = [];

        await page.goto('https://www.amazon.com.br/',{waitUntil: 'load', timeout: 0});
    
        await page.waitForSelector('#twotabsearchtextbox', {timeout: 0});
    
        await page.type('#twotabsearchtextbox', search);
    
        await Promise.all([
            page.waitForNavigation({waitUntil: 'load', timeout: 0}),
            page.click('#nav-search-submit-button')
        ])
    
         const links = await page.$$eval('.rush-component > a', el => el.map((link: any) => link.href));
    
        for(const link of links){
            if(c === index + 1) continue;
            console.log('Amazon '+c)

            await page.goto(link);
            await page.waitForSelector('#productTitle', {timeout: 0});
    
            const image = await page.$eval('#imgTagWrapperId > img', (el:any) => el.src)
            const title = await page.$eval('#productTitle', (el: any) => el.innerText);
            
                
         
            const price = await page.evaluate(() => {
                const el: any = document.querySelector('.a-price .a-offscreen');
                if(!el) return null;
                return el.innerText;
            });
    
            const seller = await page.evaluate(() => {
                const el: any = document.querySelector('#sellerProfileTriggerId');
                if(!el) return null;
                return el.innerText;
            });
    
            const obj:any = {};
            obj.title = title;
            obj.image = image;
            obj.price = price;
            (seller ? obj.seller = seller : '');
            obj.link = link;
    
            list.push(obj);
            io.emit('receiveProductsAmazonStatus', c)
            c++;
        }

        return list;
}
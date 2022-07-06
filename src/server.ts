import { getProductsAliExpress } from './services/aliExpress';
import { getProductsAmazon } from './services/amazon';
import { getProductsMercado } from './services/mercado';

import express from 'express';

import cors from 'cors'
import pup from 'puppeteer';

const app = express();

app.use(cors({
        origin: '*'
}))
app.use(express.json())

let browser: pup.Browser;
export let page: pup.Page;

app.get('/search', async (req, res) => {
        const { search, index } = req.query
        
        browser = await pup.launch();
        page = await browser.newPage()
        
        const productsMercado = await getProductsMercado(search as string, parseInt(index as string));
        const productsAmazon = await getProductsAmazon(search as string, parseInt(index as string));
        const productsAliExpress = await getProductsAliExpress(search as string, parseInt(index as string));
        await browser.close();
        res.json({ productsMercado, productsAmazon, productsAliExpress });
})


app.listen(3333, () => console.log('Running'));

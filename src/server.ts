import { getProductsAliExpress } from './services/aliExpress';
import { getProductsAmazon } from './services/amazon';
import { getProductsMercado } from './services/mercado';

import express from 'express';

import cors from 'cors'
import pup from 'puppeteer';
import http from 'http'
import { Server } from 'socket.io'

const app = express();

app.use(cors({
        origin: '*'
}))
app.use(express.json())

const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: '*' } })

let browser: pup.Browser;
export let page: pup.Page;



app.get('/search', async (req, res) => {
        const { search, index } = req.query

        browser = await pup.launch();
        page = await browser.newPage()
        const productsMercado = await getProductsMercado(search as string, parseInt(index as string));
        io.emit('receiveProductsMercado', productsMercado);
        const productsAmazon = await getProductsAmazon(search as string, parseInt(index as string));
        io.emit('receiveProductsAmazon', productsAmazon);
        const productsAliExpress = await getProductsAliExpress(search as string, parseInt(index as string));
        io.emit('receiveProductsAliExpress', productsAliExpress);
        await browser.close();
        res.status(200);
})

import './services/socket'

server.listen(3333, () => console.log('Running'));

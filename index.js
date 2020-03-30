const http = require('http');
const url = require('url');
const fs = require('fs');



const replaceTemplate = (card, product) => {
    let output = card.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%ID%}/g, product.id)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    if (!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')

    return output;

}

const temp_overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const temp_product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const temp_card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const products = JSON.parse(data)

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    if (pathname === '/' || pathname == '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })

        const cardsHtml = products.map(product => replaceTemplate(temp_card, product)).join('')
        const output = temp_overview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml)

        res.end(output)
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const product = products[query.id];
        const output = replaceTemplate(temp_product, product)
        res.end(output)
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data)


        // res.end('API')
    } else {
        res.writeHead(400, {
            'Content-type': 'text/html'
        });
        res.end('Page Not Found')
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Listening to requests on port 800')
})
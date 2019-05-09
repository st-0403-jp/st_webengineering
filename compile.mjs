const fs = require('fs');
const { JSDOM } = require('jsdom');

const head = fs.readFileSync('./src/components/_head.html', 'utf-8');
const footer = fs.readFileSync('./src/components/_footer.html', 'utf-8');

const handle = (err, temp) => {
    if (err) {
        console.log(err);
        return;
    }
    const dom = new JSDOM(temp);

    const footerHTML = new JSDOM(footer).window.document.querySelector('footer');
    dom.window.document.querySelector('#footer').after(footerHTML);
    dom.window.document.querySelector('#footer').remove();

    const body = dom.window.document.body.innerHTML;
    const html = `
    <!doctype html>
    <html>
    <head>
    ${head}
    </head>
    <body>
    ${body}
    </body>
    </html>
    `;

    fs.writeFileSync('./dist/index.html', html);
};

fs.readFile('./src/index.html', 'utf-8', handle);

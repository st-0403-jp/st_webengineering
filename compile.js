const fs = require('fs');
const { JSDOM } = require('jsdom');

const srcDir = './src/';
const componentsDir = `${srcDir}components/`;

const head = fs.readFileSync(`${componentsDir}_head.html`, 'utf-8');
const header = fs.readFileSync(`${componentsDir}_header.html`, 'utf-8');
const footer = fs.readFileSync(`${componentsDir}_footer.html`, 'utf-8');
const script = fs.readFileSync(`${componentsDir}_script.html`, 'utf-8');
const loading = fs.readFileSync(`${componentsDir}_loading.html`, 'utf-8');

const mainList = [
    srcDir + 'index.html',
    srcDir + 'about/index.html',
    srcDir + 'works/index.html',
    srcDir + 'contact/index.html'
];

const useDoc = (dom) => {
    return dom.window.document;
};

const generateHead = (page) => {
    const headDom = new JSDOM(head);
    useDoc(headDom).querySelector('link[rel=stylesheet]').href = `/css/${page}.css`;
    useDoc(headDom).querySelector('title').innerHTML = `${page} | ST WebEngineering`;
    return useDoc(new JSDOM(headDom.serialize())).querySelector('head').innerHTML;
};

const generateScript = (page) => {
    const scriptDom = new JSDOM(script);
    useDoc(scriptDom).querySelector('#pageScript').src = `/js/${page}.js`;
    useDoc(scriptDom).querySelector('#pageScript').removeAttribute('id');
    return useDoc(new JSDOM(scriptDom.serialize())).querySelector('head').innerHTML;
};

const create = (err, mainTemp) => {
    if (err) throw err;

    const mainDom = new JSDOM(mainTemp);
    const fileId = useDoc(mainDom).querySelector('main').id;

    const pageHead = generateHead(fileId);
    const pageScript = generateScript(fileId);

    const chunk = `
    <!Doctype html>
    <html lang="ja">
    <head>
    ${pageHead}
    </head>
    <body>
    ${loading}
    ${header}
    ${mainTemp}
    ${footer}
    ${pageScript}
    </body>
    </html>
    `;

    if (fileId === 'home') {
        fs.writeFileSync(`./dist/index.html`, chunk);
    } else {
        const dir = `./dist/${fileId}/`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(`${dir}index.html`, chunk);
    }
};

mainList.forEach((path) => {
    fs.readFile(path, 'utf-8', create);
});

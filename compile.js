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

const displayPageList = [
    ['home', 'Home'],
    ['about', 'About'],
    ['works', 'Works'],
    ['contact', 'Contact'],
];

const worksList = [
    {
        id: 'prolab',
        link: 'https://prolabo.co.jp/',
        explain: '知り合いのフリーランスの方からいただいたお仕事です。<br>内容は、Webサイトのコーディングで、主にホーム画面とメッセージ画面をコーディングしました。<br>最終的にWordPressにするということで、PHPを少し書いてますが、ほぼ、UI部分（HTML, CSS, JavaScript）の作成です。レスポンシブ対応してますが、デザインが素晴らしかったのでサクッとできました。<br>要件のヒアリングが足りてなく、アニメーションの処理で手間取ったので、少し工数が膨らみましたが、そこまで問題にはならずよかったです。'
    },
    {
        id: 'nab',
        link: 'https://nab.tokyo/',
        explain: '知り合いの会社からいただいたお仕事です。会社の代表の方には色々よくしてもらっています。内容はWebサイトの制作です。<br>WordPressの有料テンプレートを使用したので、コーディングはほぼしていません。<br>検索機能はテンプレートに最初から入っており、マップはGoogleへ登録してキーを入れればすぐ入るようになってます。WordPress導入する上で有料テンプレートはかなり高機能だと感じた案件でした。'
    }
];

const snsList = [
    {
        name: 'facebook',
        link: 'https://www.facebook.com/satoru.tanaka.sss/'
    },
    {
        name: 'twitter',
        link: 'https://twitter.com/sato272015/'
    },
    {
        name: 'instagram',
        link: 'https://www.instagram.com/satoru.tanaka.sss/'
    },
    {
        name: 'github',
        link: 'https://github.com/st-0403-jp/'
    },
    {
        name: 'qiita',
        link: 'https://qiita.com/st-0403-jp/'
    }
];

const mkdirDist = () => {
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
};

const makeUrl = (page) => {
    const domain = 'https://www.sssatoru-t.info/';

    let url = '';
    if (page === 'home') {
        url = domain;
    } else {
        url = `${domain}${page}/`;
    }
    return url;
};

const useDoc = (dom) => {
    return dom.window.document;
};

const generateHead = (page) => {
    const headDom = new JSDOM(head);
    const url = makeUrl(page);
    const pageTitleMap = new Map(displayPageList);

    useDoc(headDom).querySelector('#ogTitle').content = `${page}`;
    useDoc(headDom).querySelector('#ogUrl').content = `${url}`;
    useDoc(headDom).querySelector('link[rel=canonical]').href = `${url}`;
    useDoc(headDom).querySelector('link[rel=stylesheet]').href = `/css/${page}.css`;
    useDoc(headDom).querySelector('title').innerHTML = `${pageTitleMap.get(page)} | ST WebEngineering`;
    return useDoc(new JSDOM(headDom.serialize())).querySelector('head').innerHTML;
};

const generateScript = (page) => {
    const scriptDom = new JSDOM(script);
    useDoc(scriptDom).querySelector('#pageScript').src = `/js/${page}.js`;
    useDoc(scriptDom).querySelector('#pageScript').removeAttribute('id');
    return useDoc(new JSDOM(scriptDom.serialize())).querySelector('head').innerHTML;
};

const generateMain = (page, dom) => {
    if (page === 'home' || page === 'contact') {
        snsList.forEach((sns) => {
            const el = useDoc(dom).querySelector(`.compile_link_${sns.name}`);
            if (el) {
                el.href = sns.link;
            }
        });
    }

    if (page === 'home' || page === 'works') {
        worksList.forEach((item) => {
            const elTxt = useDoc(dom).querySelector(`.compile_txt_${item.id}`);
            const elLink = useDoc(dom).querySelector(`.compile_link_${item.id}`);
            if (elTxt) {
                elTxt.innerHTML = item.explain;
            }
            if (elLink) {
                elLink.href = item.link;
            }
        });
    }

    return useDoc(new JSDOM(dom.serialize())).querySelector('body').innerHTML;
};

const create = (err, mainTemp) => {
    if (err) throw err;

    const mainDom = new JSDOM(mainTemp);
    const fileId = useDoc(mainDom).querySelector('main').id;

    const pageMain = generateMain(fileId, mainDom);
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
    ${pageMain}
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

// convert
mkdirDist();
mainList.forEach((path) => {
    fs.readFile(path, 'utf-8', create);
});

/**************************************************
Welcome to this code.

**about**
  This is source code for The journey of Elaina Wiki.
  Created by tsumuri1017.
  Created using the Node.js.
**Contact**
  Mails:tsumuri1017+majotabi@googlemail.com
  Twttr:@tsumuri1017(https://twitter.com/tsumuri1017)
  Devto:@tsumuri1018(https://dev.to/tsumuri1017)
  Dscrd:tsumuri#1017(ID:875922370672599081)
**************************************************/

/*express setting*/
const express = require('express');
const app = express();
const fs = require('fs');

app.listen(3000, () => {
  console.log('server started');
});
/****************/

/*app set*/
app.get('/', (req, res) => { res.sendFile(__dirname + '/web/index.html'); });
app.get('/about/', (req, res) => { res.sendFile(__dirname + '/web/about.html'); });
app.get('/terms', (req, res) => { res.sendFile(__dirname + '/web/terms.html'); });
app.get('/header.js', (req, res) => { res.sendFile(__dirname + '/web/script/header.js'); });
app.get('/style.css', (req, res) => { res.sendFile(__dirname + '/web/style/main.css'); });
app.get('/frame.css', (req, res) => { res.sendFile(__dirname + '/web/style/frame.css'); });
app.get('/header.css', (req, res) => { res.sendFile(__dirname + '/web/style/header.css'); });
app.get('/tos', (req, res) => { res.sendFile(__dirname + '/web/terms/tos.html'); });
app.get('/copyrights', (req, res) => { res.sendFile(__dirname + '/web/terms/copyrights.html'); });
app.get('/editfile/', (req, res) => {
  const asdata = fs.readFileSync(__dirname + '/assets/admin-names', 'utf8');
  const AdminAccountNames = asdata.split("\n");
  let banusers = fs.readFileSync(__dirname + '/assets/blocked-users', 'utf8');
  banusers = banusers.split("\n");
  let time = GetDate();
  let userhandle = MakeHandle(req.headers['x-forwarded-for'], req.headers['user-agent']);
  if(banusers.indexOf(userhandle)!=-1){
res.sendFile(__dirname + '/web/blocked.html');
  }else{
  let username = req.query.user;
    if(AdminAccountNames.indexOf(username)!=-1){
    if(userhandle=='Admin.Licyan.Networks.RootSystem'){
    }else{
      username='Guest(NotAdmin)'
    }
  }
  posting(String(req.query.articlename), username, userhandle, req.query.content, time)
  res.send(`<script>location.href='/wiki/${req.query.articlename}'</script>このページから移動しない場合：JavaScriptを有効化してください。また、リダイレクトを許可してください。`);
}
}
);

app.use(function(req, res, next) {
  let path = req.path;
  let mode = 404;
  if (path.substr(1, 3) == "api") { mode = 'api'; }
  if (path.substr(1, 4) == "wiki") { mode = 'web'; }
  if (path.substr(1, 4) == "edit") { mode = 'edit'; }
  if (mode == 'api') {
    api(path.substr(5, 256));
  } else if (mode == 'web') {
    const fs = require('fs');
    let DB_keyWord = path.substr(6, 256);
    DB_keyWord = (decodeURI(DB_keyWord))
    DB_keyWord = DB_keyWord.replace('/', '')
    DB_keyWord = DB_keyWord.replace('<', '&lt;')
    DB_keyWord = DB_keyWord.replace('>', '&gt;')
    if(DB_keyWord==''){
      res.sendFile(__dirname+'/web/redirect.html');
    }else{
    if (fs.existsSync(__dirname + '/data/' + DB_keyWord + '.json')) {
      let data = (fs.readFileSync(__dirname + '/data/' + DB_keyWord + '.json', 'utf8'));
      data=String(data);
      arg=[]
      arg=data.split("\n")
      data=JSON.parse(arg[((arg.length)-2)]);
      let webdata = '';
      if(data.lastedit_handle=='Admin.Licyan.Networks.RootSystem'){      editor_webdata=`<div id="editid" style="color:green;">(ID:${data.lastedit_handle})</div>`}else{
              editor_webdata=`<div id="editid">(ID:${data.lastedit_handle})</div>`
      }
let articlebody = data.article;
articlebody=RenderingHTML(articlebody)
let articleSNSpreview = data.article;
  let counter_s = 0;
  while (counter_s < articlebody.length) {
    articlebody = articlebody.replace('{br}','<br>');
    articleSNSpreview = articleSNSpreview.replace('{br}','\n');
    articleSNSpreview = articleSNSpreview.replace('<','');
    articleSNSpreview = articleSNSpreview.replace('>','');
    counter_s++;
  }
      articlesname = data.name;
      webdata = `<!DOCTYPE HTML>
<html>
<head>
<link rel="stylesheet" href="https://majotabi.sytes.net/style.css" type="text/css">
<link rel="stylesheet" href="https://majotabi.sytes.net/header.css" type="text/css">
<title>${articlesname}-魔女の旅々Wiki</title>
<meta name="description" content="${articleSNSpreview}">
</head>
    <body>
  <div id="header">JavaScriptを有効化してください。</div>
  <script src="/header.js"></script>
      <h1>魔女の旅々Wiki</h1>
      <h2>${articlesname}</h2>
      <hr>
      <br>
      <div id="article">
      ${articlebody}</div><br>
      <div id="lastedit">
      LastEdit[${data.lastedit}] by ${data.lastedit_user}
      ${editor_webdata}
      <a href="/edit/${articlesname}">編集する</a>
      </div>
    </body>
</html>`
      res.end(webdata);
    } else {
      res.set('content-type', 'text/html');
      res.end(`<!DOCTYPE HTML>
<html>
<head>
<link rel="stylesheet" href="https://majotabi.sytes.net/style.css" type="text/css">
<link rel="stylesheet" href="https://majotabi.sytes.net/header.css" type="text/css">
<title>404-魔女の旅々Wiki</title>
<meta name="description" content="作られていない記事">
</head>
<body>
  <div id="header">JavaScriptを有効化してください。</div>
  <script src="/header.js"></script>
<h1>魔女の旅々Wiki</h1>
<h1>${DB_keyWord}はまだありません。</h1>
<hr><br>
<a href="/edit/${DB_keyWord}">作成する</a>
</body>
</html>`
 )
    }
    }
  } else if (mode == 'edit') {
    let old_article = "";
    DB_keyWord = path.substring(6, 999);
    DB_keyWord = (decodeURI(DB_keyWord))
    DB_keyWord = DB_keyWord.replace('/', '')
    const fs = require('fs');
    if (fs.existsSync(__dirname + '/data/' + DB_keyWord + '.json')) {
      let data = (fs.readFileSync(__dirname + '/data/' + DB_keyWord + '.json', 'utf8'));

      data=String(data);
      arg=[]
      arg=data.split("\n")
      data=JSON.parse(arg[((arg.length)-2)]);
      old_article = data.article;
    } else {
      old_article = "新規作成";
    }

    let counter_s = 0;
    while (counter_s < old_article.length) {
      old_article = old_article.replace('{br}', '\n');
      counter_s++;
    }
    res.set('content-type', 'text/html');
    res.send(`
<html>
    <head>
      <title>記事「${DB_keyWord}」の編集</title>
      <link rel="stylesheet" href="https://majotabi.sytes.net/style.css" type="text/css">
<link rel="stylesheet" href="https://majotabi.sytes.net/header.css" type="text/css">
    </head>
    <body>
  <div id="header">JavaScriptを有効化してください。</div>
  <script src="/header.js"></script>
      <h1>魔女の旅々Wiki</h1>
      <h2>記事「<a href="/wiki/${DB_keyWord}">${DB_keyWord}</a>」の編集</h2>
      <form action="/editfile" method="get">
      記事名(編集不可):<input type="text" name="articlename" value="${DB_keyWord}" readonly><br>
      編集者ユーザー名:<input type="text" name="user"><br><br>編集<br><textarea type="text" name="content">${old_article}</textarea><br><br>
      利用規約に同意する場合のみ、「編集」を押してください。<br>
        <br><br><button class="btn">編集</button></form>
    </body>
</html>
`)
  } else {
    res.end('Error:' + req.path + ' is not found.');
  }
});



function posting(articlename, user, handle, content, time) {
articlename=XSS_Escape(articlename);
user=XSS_Escape(user);
content=XSS_Escape(content);
  let data = {name:articlename,article:content,lastedit:time,lastedit_user:user,lastedit_handle:handle}
  data = JSON.stringify(data)
  data=data+'\n'
  const fs = require("fs");
  const options = {
  flag: 'a'
};
fs.writeFile("data/" + articlename + ".json", data, options, (err) => {
  if (err) throw err;
});

}

function GetDate() {
  let date = new Date().toLocaleString('sv').replace(/\D/g, '');
  date = Number(date);
  date = date + 90000;
  date = String(date);
   date = date.slice(0, 4) + '/' +
          date.slice(4, 6) + '/' +
          date.slice(6, 8) + ' ' +
          date.slice(8, 10) + ':' +
          date.slice(10, 12) + ':' +
          date.slice(12, 14);
  return (date);
}
function MakeHandle(ipaddress, useragent) {
  dec = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"];
  hexadec = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
  let counter;
  counter = 0;
  let ips = MakeMD5(ipaddress + useragent);
  let handleIP = '';
  while (counter < 32) {
    handleIP = handleIP + dec[hexadec.indexOf(ips.charAt(counter))];
    counter++;
  }
  if(handleIP=='dicjjhofbmbfopononnbaiolboepflpd'){
    handleIP='Admin.Licyan.Networks.RootSystem'; 
  }
return handleIP;
}

function MakeMD5(arg) {
  const crypto = require('crypto');
  const hashHex = crypto.createHash('md5').update(arg, 'utf8').digest('hex');
  return hashHex;
}

function XSS_Escape(input){

  let text = input;
for (let i = 0; i < text.length; i++) {
    text = text.replace('<h1>', '{h1}');
    text = text.replace('</h1>', '{/h1}');
    text = text.replace('<h2>', '{h2}');
    text = text.replace('</h2>', '{/h2}');
    text = text.replace('<h3>', '{h3}');
    text = text.replace('</h3>', '{/h3}');
    text = text.replace('<h4>', '{h4}');
    text = text.replace('</h4>', '{/h4}');
    text = text.replace('<', '&lt;');
    text = text.replace('>', '&gt;');
    text = text.replace("'", '&#39;');
    text = text.replace('"', '&quot;');
    text = text.replace("javascript:", 'js実行防止:');
    text = text.replace(/\r?\n/g, '{br}');
  }
  return (text);
}

function RenderingHTML(input){
  let text = input;
for (let i = 0; i < text.length; i++) {
    text = text.replace('{h1}', '<h2>');
    text = text.replace('{/h1}', '</h2>');
    text = text.replace('{h2}', '<h3>');
    text = text.replace('{/h2}', '</h3>');
    text = text.replace('{h3}', '<h4>');
    text = text.replace('{/h3}', '</h4>');
    text = text.replace('{h4}', '<h5>');
    text = text.replace('{/h4}', '</h5>');
    text = text.replace('{link}', '<a href="');
    text = text.replace('@txt=', '">');
    text = text.replace('{/link}', '</a>');
  }
  return (text);
}

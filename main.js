var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
    </body>
    </html>
    `;
}
function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i = i + 1;
    }
    list = list+'</ul>';
    return list;
}
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', function(error,filelist){
                var description = 'Hello node.js';
                var title = 'Welcome';
                var list = templateList(filelist);
                var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
            })
        } else {
            fs.readdir('./data', function(error,filelist){
                fs.readFile(`data/${queryData.id}`,'utf8', function(err, description){
                    var title = queryData.id;
                    var list = templateList(filelist);
                    var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);
            });
        });
        }
        
    } else if(pathname === '/create'){
        fs.readdir('./data', function(error,filelist){
            var description = 'Hello node.js';
            var title = 'WEB - create';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
                <P><input type="text" name="title" placeholder="title"></P>
                <P>
                    <textarea name="description" placeholder="description"></textarea>
                </P>
                <p>
                    <input type="submit" >
                </p>
            </form>
            `);
            response.writeHead(200);
            response.end(template);
        })
    } else if(pathname === '/create_process'){
        let body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            console.log(post.title);
        });
        response.writeHead(200);
        response.end('success');
    } else {
        response.writeHead(404);
        response.end('Not found');
    }


});
app.listen(3000);
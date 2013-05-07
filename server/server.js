var ejs = require('ejs')
var express = require('express')
var app = express()
var http = require('http')
var server = http.createServer(app)


app.configure(function()
{
    app.set('views', __dirname+'/../pages');
    app.set("view options",{layout:false});
    app.use('/library',express.static( __dirname + '/../library'));
    app.use('/media',express.static( __dirname + '/../media'));
    app.use('/style',express.static( __dirname + '/../style'));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
});

app.get('/', function(req,res){
    res.render('index.ejs')
});

var PORT = process.env.PORT || 3000

server.listen(PORT);

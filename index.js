var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

var morgan = require('morgan');
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "secret",
  database: "todos"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

var formidable = require('formidable');
app.post('/inserisci', cors(), function (request, response) {
  if (request.method.toLowerCase() == 'post') {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields) {
      var title = String(fields.title),
        author = String(fields.author),
        price = Number(fields.price),
        nump = Number(fields.nump)
      response.header("Access-Control-Allow-Origin", "*");
      response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      response.writeHead(200, { 'Content-Type': 'application/json' });
      var sql = "INSERT INTO books (title, author, price, nump) VALUES ('";
      sql += title + "','";
      sql += author + "',";
      sql += price + ",";
      sql += nump + ")";
      con.query(sql, function (err, result) {
        if (err) throw err;
        response.end('{ "result": "1 record inserted" }');
      });
    });
  }
});

var listener = app.listen(process.env.PORT || 8080, function () {
  console.log('listening on port ' + listener.address().port);
});

/*   con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT name, address FROM customers", function (err, result, fields) {
      if (err) throw err;
      console.log(fields);
    });
  }); */
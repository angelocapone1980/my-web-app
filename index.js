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
  password: "secret"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post('/mostra', cors(), function (request, response) {
  if (request.method.toLowerCase() == 'post') {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.writeHead(200, { 'Content-Type': 'text/html' });
    var sql = "SELECT * FROM test.books";
    con.query(sql, function (err, result, fields) {
      let tabella = "<table>";
      tabella += "<tr>";
      if (err) throw err;
      for (field of fields) {
        if (field.name != "id")
          tabella += "<th>" + field.name + "</th>";
      }
      tabella += "</tr>";
      for (var i = 0; i < result.length; i++) {
        tabella += "<tr>";
        tabella += "<td>" + result[i].title + "</td>";
        tabella += "<td>" + result[i].author + "</td>";
        tabella += "<td>" + result[i].price + "</td>";
        tabella += "<td>" + result[i].nump + "</td>";
        tabella += "</tr>";
      }
      tabella += "</table>";
      response.end(tabella);
    });
  }
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
      var sqltest = "select count(*) as conta from information_schema.tables where table_schema = 'test' and table_name = 'books'";
      let conta = 0;
      con.query(sqltest, function (err, result, fields) {
          if (err) throw err;
          for (var i = 0; i < result.length; i++) {
            conta = parseInt(result[i].conta);
          }
        });
      if (conta == 0) {
        var sqlcreateschema = "CREATE SCHEMA test";
        con.query(sqlcreateschema, function (err, result) {
          if (err) throw err;
        });

        var sqlcreatetable = "CREATE TABLE test.books (";
        sqlcreatetable+= "id int(11) NOT NULL AUTO_INCREMENT,";
        sqlcreatetable+= "title varchar(50) DEFAULT NULL,";
        sqlcreatetable+= "author varchar(50) DEFAULT NULL,";
        sqlcreatetable+= "price double DEFAULT NULL,";
        sqlcreatetable+= "nump int(11) DEFAULT NULL,";
        sqlcreatetable+= "PRIMARY KEY (id))";
        con.query(sqlcreatetable, function (err, result) {
          if (err) throw err;
        });
      }
      var sql = "INSERT INTO test.books (title, author, price, nump) VALUES ('";
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
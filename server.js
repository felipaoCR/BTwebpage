var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Create MySQL connection setup config 
var mysql_connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Ingelectrica94.',
    database: "Estudiantes"
});

// Connect to MySQL db
mysql_connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    mysql_connection.query("SELECT carne FROM Estudiantes", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });
  }); 

// Create nodemailer transport options
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'moyafelipe94@gmail.com',
    pass: 'ingelectrica94'
  }
});  

app.use(express.static('public'));

// Upload index.html to the localhost
app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/templates" + "/" + "index.html" );
 })

// Handle create_account calls thru MD template
app.get('/create_account.html', function (req, res) {
    res.sendFile( __dirname + "/templates" + "/" + "create_account.html" );
 })

// Upload create-account.html to the localhost
app.get('/create-account.html', function (req, res) {
    res.sendFile( __dirname + "/" + "create-account.html" );
 })

// Post handler if respective action gets triggered from HTML POST method
app.post('/email_confirmation', urlencodedParser, function (req, res) {
  
    var full_name   = req.body.full_name;
    var personal_id = req.body.personal_id;
    var email       = req.body.email;
    var password    = req.body.password;
    var password_con = req.body.password_confirm;

    // Password confirmation failed
    if (password != password_con)
    {
        console.log("Password confirmation failed! Passwords must match.");
        res.send("Password confirmation failed! Passwords must match.");
    }

    // Insert user input into db
    var sql_q1 = "INSERT INTO Estudiantes(carne, full_name, email, password) VALUES("+mysql.escape(personal_id)+","+mysql.escape(full_name)+","+mysql.escape(email)+","+mysql.escape(password)+");"
    mysql_connection.query(sql_q1, function (err, result) {
     if (err) throw err;
    });
    // Display db contents
    var result = mysql_connection.query("SELECT * from Estudiantes",function(err, result, fields){
     if (err) throw err;
     console.log("Successfully registered!: "+JSON.stringify(result));
    });
    // Set email options before actually sending the mail
    var mailOptions = {
        from: 'moyafelipe94@gmail.com',
        to: email,
        subject: 'Account confirmation BT',
        text: 'Please confirm your email address by clicking the CONFIRM EMAIL button below',
        html: '<h1>Email confirmation</h1><p>Please confirm email!</p>'
    };
    // Send the mail
 /*   transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });*/

  })
  
 var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
 
    console.log("Example app listening at http://%s:%s", host, port)
 
 })
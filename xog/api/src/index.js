const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "password",
    database: "xo"
});




const app = express();
app.use(bodyParser.json())
app.use(cors());


app.get('/api/getMatchs', (req, res) => {


    con.query("SELECT * FROM macth", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).send({ result: result })
    });


});


app.post('/api/match', (req, res) => {

    let id = req.body.id;
    let playerone = req.body.playerone;
    let playertwo = req.body.playertwo;
    let sizeTable = req.body.sizeTable



    let sql = "INSERT INTO macth (id, playerone,playertwo,sizeTable) VALUES ('" + id + "', '" + playerone + "', '" + playertwo + "','" + sizeTable + "')";

    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.status(200).send("Insert complete")
    });



});



app.post('/api/stepsabll', (req, res) => {

    let id = req.body.id;

    con.query("SELECT * FROM step WHERE macthid = '"+id+"'", function (err, result) {
        if (err) throw err;

        res.status(200).send({ result: result })
    });


});


app.post('/api/steps', (req, res) => {

    let id = req.body.id;
    let cellid = req.body.cellid;
    let player = req.body.player;
    let macthid = req.body.macthid

    

    let sql = "INSERT INTO step (id, cellid,player,macthid) VALUES ('" + id + "', '" + cellid + "', '" + player + "','" + macthid + "')";

    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.status(200).send("Insert complete")
    });

});


app.listen(3001, () => {
    console.log('api Endpoint on port 3001');
})


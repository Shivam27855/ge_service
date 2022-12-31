const express=require("express");
const app=new express();
const bodyParser = require('body-parser');

var mysql = require('mysql2');
var userId;
//local sql:

// host: "localhost",
// user: "root",
// password: "root",
// database: 'todo_app'


//deployed sql:
// host: "containers-us-west-158.railway.app",
//   user: "root",
//   password: "WxLcZBeO0jHNLjUsdeZL",
//   database: 'railway',
//   port:7662

var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: 'ge_app'
});



con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  const cors = require('cors');
  app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.send("Running");
})

app.post("/getUser",(req,res)=>{
    con.query('SELECT * FROM ge_login where username="'+req.body.username+'" and password="'+req.body.password+'"', (err, rows, fields) => {
        if (err) throw err
        let dataLength=rows.length;
        if(dataLength==0)
        res.send({"error":"Invalid Username or Password"});
        else
        {
            res.send(rows);
        }
    })
})




app.post("/addUser",(req,res)=>{
con.query("INSERT INTO ge_login (username, password) VALUES('"+req.body.username+"','"+req.body.password+"')", (err, rows, fields) => {
    if (err)
    {
        if(err.code=="ER_DUP_ENTRY")
        {
            res.send({"error":"Username Already Exists"});
        }
        else
        {
            res.send({"error":"Unknown Error"});
        }
    } 
    else
    {
        res.send(rows);
    }
    })
})


app.post("/addGeItem",(req,res)=>{
    con.query(`INSERT INTO ge_list (item_shortname,item_name,item_company,item_modal,item_subcategory,item_warranty,item_cp,item_sp,item_description) VALUES('${req.body.item_shortname}','${req.body.item_name}','${req.body.item_company}','${req.body.item_modal}','${req.body.item_subcategory}','${req.body.item_warranty}',${req.body.item_cp},${req.body.item_sp},'${req.body.item_description}')`, (err, rows, fields) => {
        if (err)
        {
            console.log(err);
            res.send({"error":"Ge Item can not be added"});
        } 
        else
        {
            res.send(rows);
        }
    })
})

app.post("/editGeItem/:itemId",(req,res)=>{
    let currGeId=req.params['itemId'];
    con.query(`UPDATE ge_list SET item_shortname='${req.body.item_shortname}',item_name='${req.body.item_name}',item_company='${req.body.item_company}',item_modal='${req.body.item_modal}',item_subcategory='${req.body.item_subcategory}',item_warranty='${req.body.item_warranty}',item_cp=${req.body.item_cp},item_sp=${req.body.item_sp},item_description='${req.body.item_description}' WHERE item_id=${currGeId}`, (err, rows, fields) => {
        if (err)
        {
            res.send("Ge Item can not be edited");
            //res.send(err);
        } 
        else
        {
            res.send(rows);
        }
    })
})

app.get("/deleteGeItem/:itemId",(req,res)=>{
    let currGeId=req.params['itemId'];
    con.query("DELETE FROM ge_list WHERE item_id="+currGeId, (err, rows, fields) => {
        if (err)
        {
            res.send("Ge Item can not be deleted");
        } 
        else
        {
            res.send(rows);
        }
    })
})

//GE Project services

app.get("/getGeItem",(req,res)=>{
    con.query('SELECT * FROM ge_list', (err_geItem, rows_geItem, fields_todoItem) => {
    if (err_geItem) throw err_geItem
    let dataLength_geItem=rows_geItem.length;
    if(dataLength_geItem==0)
    res.send({"error":"No Item in Inventory"});
    else
    {
       res.send(rows_geItem)  
    }
})

})

  

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is started on ${PORT}`);
});
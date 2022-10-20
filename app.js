import express from 'express'
import bodyParser from 'body-parser'
import _ from 'lodash'
import ejs from 'ejs'
import mongoose, { mongo } from 'mongoose'


const app = express();

app.set('view engine','ejs');


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/quantityDB");

var items = [];
var wrong;
var quantity;

//requests collection
const requestSchema = {
    quantity : Number,
}
const Request = mongoose.model("Request",requestSchema);

//approved requests collection
const approvedSchema = {
    quantity : Number,
}
const Approved = mongoose.model("Approved",approvedSchema);


//login
app.get('/',function(req,res){
    res.render("home",{
        wrong:wrong,
    });
})
           

    
app.post('/',function(req,res){
    var credentials = {
        username: req.body.username,
        password: req.body.password,
    }
    console.log("The user name is "+ credentials.username + " and the password entered is " + credentials.password);

    if(credentials.username=="admin" && credentials.password=="admin"){
        console.log("You have logged in as admin!");
        res.redirect('/admin');
    }
    else if(credentials.username=="supervisor" && credentials.password=="supervisor"){
        console.log("You have logged in as supervisor");
        res.redirect("/supervisor");
    }
    else{
        console.log("Sorry Wrong credentials!");
        res.redirect('/');
    }


    
})

//admin
app.get("/admin",function(req,res){
    Approved.find({},function(err,approved){
        console.log(approved);
    })
        
       
    Request.find({},function(err,requests){
        res.render("admin",{
            requests:requests,
        });
    })
    
    
})
//delete
app.post("/delete",function(req,res){
    var listId = req.body.list;
    
    // const listQuantity = req.body.list.getAttribute("data-value");
    Request.findByIdAndRemove(listId,function(err){
        if(!err){
            console.log("Deleted item with ID " + listId);
            res.redirect("/admin");
        }
    })


})

//super-visor
app.get("/supervisor",function(req,res){
    
    Request.find({},function(err,requests){
        res.render("supervisor",{
            requests:requests,
            
        });
        
    })
})
app.post("/supervisor",function(req,res){
    quantity = req.body.request;
    var quantity_db = new Request({quantity:quantity});
    quantity_db.save();
    items.push(quantity_db);
    console.log(quantity);
    console.log(items);
    res.redirect("/supervisor");
})


app.listen(3000,function(){
    console.log("Server started on port 3000");
})
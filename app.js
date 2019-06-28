//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true})

const todolostSchema = mongoose.Schema({
  item:String
})

const ItemCollection = mongoose.model('ItemCollection',todolostSchema);

const firstItem = new ItemCollection({
  item:'wakinng up'
})

const secondItem = new ItemCollection({
  item:'do some shit'
})

const thirdItem = new ItemCollection({
  item:'sleep again'
})

const defaultItems = [firstItem,secondItem,thirdItem]



app.get("/", function(req, res) {
  const day = date.getDate();
  ItemCollection.find({},function(err,result) {
 if (result.length === 0) {
  ItemCollection.insertMany(defaultItems,function(err){
    if (err) {
      console.log("error found");
    } else { console.log('just uploaded the default files') }
  });
  res.redirect("/");
 } else {
    console.log("did the last else statement");
    res.render("list", {listTitle: day , newListItems: result});
 }
    
  });
});

app.post("/delete",function(req,res){
 const checkboxId = req.body.checkbox;
 ItemCollection.findByIdAndRemove(checkboxId,function(err){
   if (err) {
     console.log(err);
   } else {
    //  console.log('succesfully deleted item with id ' + checkboxId);
     res.redirect('/');
   }
 })
})

app.post("/", function(req, res){

  const addedText = req.body.newItem;

  var newItem = new ItemCollection({
    item:addedText
  })
  newItem.save()
  res.redirect("/");
  }
);

app.get("/:param",function(req,res){
  console.log(req.params.param);
})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var _ = require('lodash');
const date = require(__dirname + "/date.js");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);


let items = ["But food", "Cook food", "Eat food"];
let workItems = [];

const item1 = new Item({
    name: "Welcome to your todolist."
});


const item2 = new Item({
    name: "Hit the + button to add a new item."
});


const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){
    //let day = date.getDate();
    Item.find({}, function(err, foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully updated the default items.");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    })
});

app.post("/", function(req, res){
    let itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Successfully deleted checked item"); 
                res.redirect("/");
            }
        });
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            };
        })
    }
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
            else{
                //Show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });
});

app.post("/work", function(req, res){
    let item = req.body.newItem;
    workItems.push(item);
    // console.log(item);
    res.redirect("/work");
})

app.get("/about", function(req, res){
    res.render("about");
})



app.listen(3000, function(){
    console.log("server has started on port 3000");
});

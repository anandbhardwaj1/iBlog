var express = require("express");
var router = express.Router();
const bodyParser=require("body-parser");
var Blog = require("../models/blog.js");
var Node = require("../models/node.js");


const { body, validationResult } = require('express-validator');
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


Blog.find().sort({"rating" : -1});




router.get("/read/:id", function (req, res) {

  var nodesArr = [];
  Blog.findOne({ _id: req.params.id }).then((blog) => {
    blog.nodes.forEach((blogNode, index) => {
      Node.findOne({ _id: blogNode })
        .then((node) => {
          nodesArr[index] = node;
        })
        .then(() => {
          if (index === blog.nodes.length - 1) {
            for (var i = 0; ; i++) {
              if (typeof nodesArr[index]._id !== "undefined") {
                setTimeout(() => {
                  res.render("readStory", { blog, nodesArr });
                }, 2000);
                break;
              }
            }
          }
        });
    });
  });
});

router.get("/", function (req, res) {

  Blog.find().sort({"rating" : -1});



  Blog.find().sort({"rating" : -1}).find({}, function (err, blogs) {
    var nodesArr = [];
    blogs.forEach((blog, index) => {
      Node.findOne({ _id: blog.initialNode })
        .then((node) => {
          nodesArr[index] = node;
          // console.log(JSON.stringify(node));
          // console.log('Check' ,nodesArr);
        })
        .then(() => {
          if (index === blogs.length - 1) {
            for (var i = 0; ; i++) {
              if (typeof nodesArr[index].content !== "undefined") {
                setTimeout(() => {
                  res.render("showAllBlogs", { blogs, nodesArr });
                }, 2000);

                break;
              }
            }
          }
        });
    });
  });
});

router.get("/feedback/:id",function(req,res)
{
  res.render("test",{id:req.params.id});
});

router.get("/load/:id", function (req, res) {
  Node.findOne({ _id: req.params.id }).then((node) => {
    res.send(node);
  });
});

  router.post("/new/:id",  [

  body('rating').isNumeric({ min: 0,max :5})
], function(req,res)
  {
    const errors=validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {

        res.send("Invalid Rating");
      console.log(errors);
      //  console.log(req.body.nodes[0].content);

    }
else
{
     var num1=Number(req.body.rating);

let id=req.param.id;

Blog.findByIdAndUpdate(
    req.params.id,
   {$inc: {rating:num1 }},

   {upsert:false},

   function(err, document){


});


       res.redirect("/");

}
  });





module.exports = router;

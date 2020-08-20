var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
const { body, validationResult } = require('express-validator');

var mongoose = require("mongoose");
var async = require("async");

var Node = require("../models/node");
var Blog = require("../models/blog");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get("/", function (req, res) {
  res.render("index");
});

router.get("/postStory", function (req, res) {
  res.render("postStory");
});

router.get("/viewAllBlogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    var nodesArr = [];
    blogs.forEach((blog, index) => {
      Node.findOne({ _id: blog.initialNode })
        .then((node) => {
          nodesArr[index] = node;
        })
        .then(() => {
          if (index === blogs.length - 1) {
            for (var i = 0; ; i++) {
              if (typeof nodesArr[index].content !== "undefined") {
                setTimeout(() => {
                  res.render("writerAllBlogs", { blogs, nodesArr });
                }, 2000);
                break;
              }
            }
          }
        });
    });
  });
});

router.post("/post",[

  body('blog.name')
    .trim().not().isEmpty(),
   body('nodes.*.content')
      .trim().not().isEmpty()


], function (req, res) {

  const errors=validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {

      res.send(500);
    console.log(errors);
    //  console.log(req.body.nodes[0].content);

  }
else{



 var reqBlog = req.body.blog;

  var nodes = [];
  var newBlog = new Blog({
    name: reqBlog.name,
  });

  var nodesArr = req.body.nodes;
  nodesArr.forEach((element) => {
    var newNode = new Node({
      _id: new mongoose.mongo.ObjectId(),
      content: element.content,
      end: element.end,
    });

    newBlog.nodes.push(newNode._id);

    if (element.end === "false") {
      newNode.question.content = element.question;

      element.options.forEach((option) => {
        var optionObject = {};
        optionObject.key = option;
        newNode.question.options.push(optionObject);
      });
    }

    newBlog.initialNode = newBlog.nodes[0];

    nodes.push(newNode);
    newNode.save();
  });

  newBlog
    .save()
    .then((result) => {
      res.send(200);
    })
    .catch((err) => {});
}

});

router.post("/edit/:id", function (req, res) {
  Node.findOne({ _id: req.body.nodeId }).then((node) => {
    var x = 0;
    node.question.options.forEach((option, index) => {
      console.log(req.body);
      node.question.options[index].mapping = req.body.mappings[index].mapping;
      if (req.body.mappings.length - 1 === index) {
        Node.findOneAndUpdate({ _id: req.body.nodeId }, node, function (
          err,
          result
        ) {
          if (!err) {
            setTimeout(() => {
              res.redirect("/writing/viewAllBlogs");
            }, 2000);
          }
        });
      }
    });
  });
});


router.get("/posterror", function (req, res) {
  res.send('<h1>Error:Invalid Data Sent</h1>');
});

router.get("/postStory", function (req, res) {
  res.render("postStory");
});



router.get("/edit/:id", function (req, res) {
  var nodesArr = [];
  // console.log(req.params.id);
  Blog.findOne({ _id: req.params.id }).then((blog) => {
    blog.nodes.forEach((blogNode, index) => {
      // console.log(blogNode);
      Node.findOne({ _id: blogNode })
        .then((node) => {
          nodesArr[index] = node;
        })
        .then(() => {
          if (index === blog.nodes.length - 1) {
            for (var i = 0; ; i++) {
              if (typeof nodesArr[index]._id !== "undefined") {
                setTimeout(() => {
                  res.render("makeMapping", { blog, nodesArr });
                }, 2000);

                break;
              }
            }
          }
        });
    });
  });
});

module.exports = router;

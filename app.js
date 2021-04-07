
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const articleScema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleScema);

app.route("/articles")

    .get( function(req, res) {

        Article.find( function(err, foundItems) {
            if(!err)
            {
                res.send(foundItems);
            } else {
                console.log(err);
            }
        });
    })

    .post( function(req, res) {
        // console.log(req.body.title);
        // console.log(req.body.content);
        const article =  new Article (
            {
                title: req.body.title,
                content:req.body.content
            }
        );
        article.save( function(err) {
            if(err)
            {
                res.send(err);
            } else
            {
                res.send("done");
            }
        });

    })

    .delete( function(req, res) {
        Article.deleteMany( function(err) {
            if(!err)
            {
                res.send("done");
            } else
            {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")

    .get(function(req, res) {

        Article.findOne({title:req.params.articleTitle}, function(err, foundArticle) {
            if(err) {
                res.send("not found");
            } else {
                res.send(foundArticle);
            }
        })
    })
    .put(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {title:req.body.title, content: req.body.content},
            {overwrite: true},
            function(err) {
                if(!err) {
                    res.send("updated");
                }
            }
        );
    })
    .patch(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err) {
                    res.send("patched");
                }
            }
        );
    })
    .delete(function(req, res) {
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err) {
                if(!err) {
                    res.send("deleted one");
                }
            }
        );
    });

app.listen(process.env.PORT || 3000, function()
{
    console.log("up and running");
})

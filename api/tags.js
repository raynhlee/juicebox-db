const express = require("express");
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

//todo "When there is a hash string in a url,
//todo everything after the # gets treated as a fragment"
//todo ^ what does this mean ?
tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  // read the tagname from the params
  //todo correct ?
  const tagName = req.params.tagName;
  try {
    // use our method to get posts by tag name from the db
    //todo correct ?
    const posts = await getPostsByTagName(tagName);
    // send out an object to the client { posts: // the posts }
    //todo correct ?
    res.send({ posts });
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    //todo ^idk how to do this
  }
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();
  res.send({
    tags,
  });
});

module.exports = tagsRouter;

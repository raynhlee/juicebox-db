const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require("../db");

//
const { requireUser } = require("./utils");
postsRouter.post("/", requireUser, async (req, res, next) => {
  res.send({ message: "under construction" });
});
//

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.get("/", async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();
    //todo "filter out any posts which are both inactive and not owned by the current user"
    //todo this provided filter code already does that ?
    const posts = allPosts.filter((post) => {
      return post.active || (req.user && post.author.id === req.user.id);
    });

    res.send({
      posts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
  //todo postman test
});

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  //todo why split method? & why have that arg?
  //todo "split will turn the string into an array, splitting over any number of spaces"
  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    // add authorId, title, content to postData object
    postData.authorId =
      //todo req.headers.something??;
      //todo user.authorId ?? "hint, we have access to the current user"
      //todo how do we have access to user in here??
      postData.title = title;
    postData.content = content;
    //
    const post = await createPost(postData);
    // this will create the post and the tags for us
    //
    // if the post comes back, res.send({ post });
    post && res.send({ post });
    // otherwise, next an appropriate error object
  } catch ({ name, message }) {
    //todo what would trigger this catch statement & what would happen when triggered?
    //todo should i replace it so i can "next an appropriate error object"
    next({ name, message });
    //todo why send this obj in next statement?
  }
  //todo "what to pass in for the key tags"
  //todo wants us to add tags key to postData? maybe:
  //todo post.tags && postData.tags = post.tags
});

//todo need help testing this patch request on postman
postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      //todo how does passing in this 2nd arg obj lead to deleting a post?
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      //todo at this point, how do we know someone is trying to delete a post that isn't theirs?
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : {
              name: "PostNotFoundError",
              message: "That post does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
  //todo help test on postman
});

module.exports = postsRouter;

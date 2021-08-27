const express = require('express');
const { getAllTags , getPostsByTagName} = require('../db');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");
  next(); // THIS IS DIFFERENT
});

tagsRouter.get('/', async (req, res) => {
    const posts = await getAllTags();
  
    res.send({
      posts
    });
  });

  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const { tagName } = req.params;

    try {
      const allPosts = await getPostsByTagName(tagName)
      // filter out posts that are inactive and now owned by the current user
       const posts = allPosts.filter(post => {
        return post.active || (req.user && post.author.id === req.user.id);
      });

      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
      res.send({ posts: posts })
      next();

    } catch ({ name, message }) {
      // forward the name and message to the error handler
    }
  });

module.exports = tagsRouter;
©
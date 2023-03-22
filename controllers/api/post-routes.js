const router = require('express').Router();
const { Post, Comments, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
      const dbPosts = await Post.findAll({
        include: [
          { model: Comments },
          { model: User,
            attributes: { exclude: ['password'] }
          }
        ]
      });
      res.json(dbPosts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
      const dbFindOnePost = await Post.findByPk(req.params.id, {
        include: [
            { model: Comments }, 
            { model: User,
                attributes: { exclude: ['password'] } 
            }
        ]
      });
  
      if (!dbFindOnePost) {
        res.status(404).json('No user found with this id');
        return;
      }
  
      res.json(dbFindOnePost);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
      if (req.session) {
        const dbNewPost = await Post.create({
          title: req.body.title,
          content: req.body.content,
          user_id: req.session.user_id,
        });
        res.json(dbNewPost);
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
      const dbUpdatePost = await Post.update({
        title: req.body.title,
        post_content: req.body.content
      },
      {
        where: {
          id: req.params.id
        }
      });
      if (!dbUpdatePost) {
        res.status(404).json('No post found with this id');
        return;
      }
      res.json(dbUpdatePost);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
      const dbDeletePost = await Post.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (!dbDeletePost) {
        res.status(404).json('No comment found with this id');
        return;
      }
  
      res.json(dbDeletePost);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});



module.exports = router;
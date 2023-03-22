const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Post, Comments, User } = require('../../models');

router.get('/', async (req, res) => {
    try {
      const dbComments = await Comments.findAll({
        include: [
          { model: Post },
          { model: User,
            attributes: { exclude: ['password'] }
          }
        ]
      });
      res.json(dbComments);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
      const dbComments = await Comments.findByPk(req.params.id, {
        include: [
            { model: Post }, 
            { model: User,
                attributes: { exclude: ['password'] } 
            }
        ]
      });
  
      if (!dbComments) {
        res.status(404).json('No user found with this id');
        return;
      }
  
      res.json(dbComments);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});
  

router.post('/', withAuth, async (req, res) => {
    try {
      if (req.session) {
        const dbComments = await Comments.create({
          comment_text: req.body.comment_content,
          post_id: req.body.post_id,
          user_id: req.session.user_id,
        });
        res.json(dbComments);
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
      const dbUpdateComment = await Comments.update({
        comment_content: req.body.comment_content
      },
      {
        where: {
          id: req.params.id
        }
      });
      if (!dbUpdateComment) {
        res.status(404).json('No post found with this id');
        return;
      }
      res.json(dbUpdateComment);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

router.delete('/:id', withAuth, async (req, res) => {
    try {
      const dbComments = await Comments.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (!dbComments) {
        res.status(404).json('No comment found with this id');
        return;
      }
  
      res.json(dbComments);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});
  

module.exports = router;

const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { User, Post, Comments } = require('../../models');

router.get('/', async (req, res) => {
    try {
      const dbUser = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json(dbUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
      const dbUser = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Post }, { model: Comments }]
      });
  
      if (!dbUser) {
        res.status(404).json('No user found with this id');
        return;
      }
  
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
      const dbUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
  
      req.session.userId = dbUser.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
  
      req.session.save(() => {
        res.json(dbUser);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});
  
  
router.post('/login', async (req, res) => {
    try {
      const dbUserLogin = await User.findOne({
        where: {
          username: req.body.username
        }
      });
      
      if (!dbUserLogin) {
        res.status(400).json('No user with that username!');
        return;
      }
  
      const validPassword = dbUserLogin.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json('Incorrect password!');
        return;
      }
  
      req.session.save(() => {
        req.session.userId = dbUserLogin.id;
        req.session.username = dbUserLogin.username;
        req.session.loggedIn = true;
  
        res.json({ user: dbUserLogin, message: 'You are now logged in!' });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    }
    else {
      res.status(404).end();
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const userPk = await User.findByPk(req.params.id);
        if (!userPk) {
          res.status(404).json('No user found with this id!');
          return;
        }
        
        await userPk.update(req.body.content); 
        
        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }, { model: Comments }]
        });
        
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
});
  
router.delete('/:id', async (req, res) => {
    try {
      const deleteUser = await User.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (!deleteUser) {
        res.status(404).json('No user found with this id!');
        return;
      }
  
      res.status(200).json('The user has been deleted.');
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
module.exports = router; 
var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var Log = sequelize.import('../models/log');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const validateSession = require('../middleware/validate-session')



//http://localhost:3000/api/user
/*
{
    "username": "Shiraz",
    "password": "raz"
}
*/


//   api/user
router.post('/user', (req, res) => {
    User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    .then(
        createSuccess = (user) => {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60*60*24 })
            res.json({
                user: user,
                message: 'user created',
                sessionToken: token
            })
        },
        createError = err => res.send(500, err)
    )
})


//  /api/login
router.post('/login', (req, res) => {

    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, matches) => {
                if(matches){
                    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60*60*24 })
                    res.json({
                        user: user,
                        message: 'successfully authenticated user',
                        sessionToken: token

                    })
                }else {
                    res.status(502).send({ error: 'bad gateway' })
                }
            })
        }else {
            res.status(500).send({ error: 'failed to authenticate' })
        }
    err => res.status(501).send({ error: 'failed to process' })
    })
})



/*
{

    "description": "tricep exercise",
    "definition": "tricep pulldown with cable",
    "result": "stronger triceps",
    "owner": 4

}
*/

//    /api/log     (POST)
router.post('/log', validateSession, (req, res) => {
    const logRequest = {
        description: req.body.description,
        definition: req.body.definition,
        result: req.body.result,
        owner: req.user.id
    }

    Log.create(logRequest)
        .then(log => res.status(200).json(log))
        .catch(err => res.json(req.errors))

})

//      /api/log            (GET)
router.get('/log', function(req, res) {

    Log
      .findAll({ //1
          attributes: ['id', 'description', 'definition', 'result', 'owner']
      })
      .then(
          function findAllSuccess(logRequest) {
              console.log("Workout:", logRequest);
              res.json(logRequest);
          },
          function findAllError(err) {
              res.send(500, err.message);
          }
      );
  });




//     /api/log/:id    (GET)         
router.get('/log/:id', (req, res) => {
    Log.findOne({
        where: {id: req.params.id}
    })
    .then(log => res.status(200).json(log))
    .catch(err => res.status(500).json({
        error: err }))
})


//          /api/log/:id   (PUT)
router.put('/log/:id', (req, res) => {
    Log.update(req.body, {
        where: {id: req.params.id}})
        .then(log => res.status(200).json(log))
        .catch(err => res.json(req.errors))

    })



//          /api/log/:id   (DELETE)
router.delete('/log/:id', (req, res) => {
    Log.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(log => res.status(200).json(log))
    .catch(err => res.json({
        error: err
    }))
})



module.exports = router;


import * as express from 'express';
import UserCtrl from '../controllers/user';
import DoorCtrl from '../controllers/door';
import CardCtrl from '../controllers/card';
import Card from '../models/card';
import * as mongoose from 'mongoose';

import {jwtSecret} from '../app';
import * as jwt from 'jsonwebtoken';
import {ObjectID} from 'mongodb';

const cardsCollectionName = 'cards';
const mongodbURI = 'mongodb://localhost:27017/artoo';


export default function setRoutes(app) {
  



  const router = express.Router();

  const userCtrl = new UserCtrl();
  const doorCtrl = new DoorCtrl();
  const cardCtrl = new CardCtrl();
  
  const card = Card;
  //router.route('/*').post(auth);
  //router.route('/*').put(auth);
  //router.route('/*').delete(auth);
  //router.route('/*').get(auth);

  router.route('/login').post(userCtrl.login);
  router.route('/logout').post(userCtrl.login);
  router.route('/register').post(userCtrl.register);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  router.route('/door').post(doorCtrl.insert);
  router.route('/door/:id').put(doorCtrl.update);
  router.route('/door/:id').get(doorCtrl.get);
  router.route('/door/:id').delete(doorCtrl.delete);

  router.route('/card').post(cardCtrl.insert);
  router.route('/card/:id').put(cardCtrl.update);
  router.route('/card/:id').get(cardCtrl.get);
  router.route('/card/:id').delete(cardCtrl.delete);

  

  router.get('/checkCard', (req, res) => {
  
if (req.query.cardId && req.query.doorId){

  console.log(JSON.stringify(req.query));
    card.findOne({_id:ObjectID(req.query.cardId)}, (err, card) => {
      if(err) {
        res.status(500).send({status: 'ERROR'});
        throw err;
      } else {

        if(card == null) {
          res.status(500).send({status: 'ERROR'});
          return;
        }
          hasDoor(card, req.query.doorId, (door) =>{
            console.log('Door has this result: '+JSON.stringify(door));
            if(door != null) res.status(200).send({status: 'OK'});
            else res.status(401).send({status: 'NO'});
            console.log("Card checked");
          })
        }
      });
    }
  });

  app.use('/api', router);
}




export function getObject(collection,id,callback){
  let query = {_id: ObjectID(id)};

  //console.log(id);
  //console.log(JSON.stringify(query));
    mongoose.connect(mongodbURI).then (db => {
       db.collection(collection).findOne(query, function(err, result) {
        console.log(result);
        callback(err,result);
      });
    });




 

}

export function hasDoor(card, doorId, callback){
    console.log('has door: ' + JSON.stringify(card));
      for(var i=0; i<card.doors.length;i++ ){
        console.log('Door ID: '+card.doors[i].id +' Card ID: ' + doorId);
        if(card.doors[i].id === doorId) {
          callback(card.doors[i]);
          return;
        }   
      }
      console.log("NO DOOR: exiting from for loop");
      callback(null);
      return;
}


export function auth(req, res, next){
  console.log('hauth');
  console.log(req.originalUrl);

  if (req.originalUrl.indexOf('login') > 0 || req.originalUrl.indexOf('register')> 0 || req.originalUrl.indexOf('logout') > 0){
    next();
    return;
  }

  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err) return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
    console.log('token verified: ');
    req.userId = decoded.id;
    next();
  });
}

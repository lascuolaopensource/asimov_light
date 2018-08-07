"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var user_1 = require("../controllers/user");
var door_1 = require("../controllers/door");
var card_1 = require("../controllers/card");
var card_2 = require("../models/card");
var mongoose = require("mongoose");
var app_1 = require("../app");
var jwt = require("jsonwebtoken");
var mongodb_1 = require("mongodb");
var cardsCollectionName = 'cards';
var mongodbURI = 'mongodb://localhost:27017/artoo';
function setRoutes(app) {
    var router = express.Router();
    var userCtrl = new user_1.default();
    var doorCtrl = new door_1.default();
    var cardCtrl = new card_1.default();
    var card = card_2.default;
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
    router.get('/checkCard', function (req, res) {
        if (req.query.cardId && req.query.doorId) {
            console.log(JSON.stringify(req.query));
            card.findOne({ _id: mongodb_1.ObjectID(req.query.cardId) }, function (err, card) {
                if (err) {
                    res.status(500).send({ status: 'ERROR' });
                    throw err;
                }
                else {
                    if (card == null) {
                        res.status(500).send({ status: 'ERROR' });
                        return;
                    }
                    hasDoor(card, req.query.doorId, function (door) {
                        console.log('Door has this result: ' + JSON.stringify(door));
                        if (door != null)
                            res.status(200).send({ status: 'OK' });
                        else
                            res.status(200).send({ status: 'NO' });
                        console.log("Card checked");
                    });
                }
            });
        }
    });
    app.use('/api', router);
}
exports.default = setRoutes;
function getObject(collection, id, callback) {
    var query = { _id: mongodb_1.ObjectID(id) };
    //console.log(id);
    //console.log(JSON.stringify(query));
    mongoose.connect(mongodbURI).then(function (db) {
        db.collection(collection).findOne(query, function (err, result) {
            console.log(result);
            callback(err, result);
        });
    });
}
exports.getObject = getObject;
function hasDoor(card, doorId, callback) {
    console.log('has door: ' + JSON.stringify(card));
    for (var i = 0; i < card.doors.length; i++) {
        console.log('Door ID: ' + card.doors[i].id + ' Card ID: ' + doorId);
        if (card.doors[i].id === doorId) {
            callback(card.doors[i]);
            return;
        }
    }
    console.log("NO DOOR: exiting from for loop");
    callback(null);
    return;
}
exports.hasDoor = hasDoor;
function auth(req, res, next) {
    console.log('hauth');
    console.log(req.originalUrl);
    if (req.originalUrl.indexOf('login') > 0 || req.originalUrl.indexOf('register') > 0 || req.originalUrl.indexOf('logout') > 0) {
        next();
        return;
    }
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, app_1.jwtSecret, function (err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        console.log('token verified: ');
        req.userId = decoded.id;
        next();
    });
}
exports.auth = auth;
//# sourceMappingURL=routes.js.map
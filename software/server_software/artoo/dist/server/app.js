"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var routes_1 = require("./routes/routes");
var app = express();
exports.app = app;
var jwtSecret = 'XyZ2018yAcCeSsi';
exports.jwtSecret = jwtSecret;
app.set('port', (process.env.PORT || 8080));
app.use('/', express.static(path.join(__dirname, '../artoo')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var mongodbURI = 'mongodb://localhost:27017/artoo';
exports.mongodbURI = mongodbURI;
//let db;
mongoose.Promise = global.Promise;
mongoose.connect(mongodbURI)
    .then(function (db) {
    //db = db;
    console.log('Connected to MongoDB');
    routes_1.default(app);
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../artoo/index.html'));
    });
    if (!module.parent) {
        app.listen(app.get('port'), function () { return console.log("Angular Full Stack listening on port " + app.get('port')); });
    }
})
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=app.js.map
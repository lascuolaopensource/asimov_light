"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var BaseCtrl = /** @class */ (function () {
    function BaseCtrl() {
        var _this = this;
        this.getAll = function (req, res) {
            _this.model.find({}, function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.status(200).json(docs);
            });
        };
        this.count = function (req, res) {
            _this.model.count(function (err, count) {
                if (err) {
                    return console.error(err);
                }
                res.status(200).json(count);
            });
        };
        this.insert = function (req, res) {
            var obj = new _this.model(req.body);
            obj.save(function (err, item) {
                if (err && err.code === 11000) {
                    res.sendStatus(400);
                }
                if (err) {
                    return console.error(err);
                }
                res.status(200).json(item);
            });
        };
        this.get = function (req, res) {
            _this.model.findOne({ _id: mongodb_1.ObjectID(req.params.id) }, function (err, item) {
                if (err) {
                    return console.error(err);
                }
                res.status(200).json(item);
            });
        };
        this.update = function (req, res) {
            _this.model.findOneAndUpdate({ _id: req.params.id }, req.body, function (err) {
                if (err) {
                    return console.error(err);
                }
                res.sendStatus(200);
            });
        };
        this.delete = function (req, res) {
            _this.model.findOneAndRemove({ _id: req.params.id }, function (err) {
                if (err) {
                    return console.error(err);
                }
                res.sendStatus(200);
            });
        };
    }
    return BaseCtrl;
}());
exports.default = BaseCtrl;
//# sourceMappingURL=base.js.map
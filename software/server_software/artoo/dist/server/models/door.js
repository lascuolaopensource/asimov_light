"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var doorSchema = new mongoose.Schema({
    name: String
});
doorSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return ret;
    }
});
var Door = mongoose.model('Door', doorSchema, 'doors');
exports.default = Door;
//# sourceMappingURL=door.js.map
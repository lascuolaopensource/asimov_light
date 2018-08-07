"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var cardSchema = new mongoose.Schema({
    cardId: String,
    doors: Array
});
cardSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        return ret;
    }
});
var Card = mongoose.model('Card', cardSchema, 'cards');
exports.default = Card;
//# sourceMappingURL=card.js.map
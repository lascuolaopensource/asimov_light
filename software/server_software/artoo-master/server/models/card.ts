import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  cardId: String,
  doors: Array
});

cardSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    return ret;
  }
});

const Card = mongoose.model('Card', cardSchema, 'cards');

export default Card;

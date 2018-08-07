import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const doorSchema = new mongoose.Schema({
  name: String
});

doorSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    return ret;
  }
});

const Door = mongoose.model('Door', doorSchema, 'doors');

export default Door;

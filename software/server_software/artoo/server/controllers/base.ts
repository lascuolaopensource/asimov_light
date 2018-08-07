import {ObjectID} from 'mongodb';

abstract class BaseCtrl {

  abstract model: any;

  getAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  };

  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  };

  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  };

  get = (req, res) => {
    this.model.findOne({ _id: ObjectID(req.params.id )}, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  };

  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  };

  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}

export default BaseCtrl;

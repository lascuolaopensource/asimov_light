import * as express from 'express';
import * as mongoose from 'mongoose';
import * as path from 'path';
import setRoutes from './routes/routes';
const app = express();
const jwtSecret  = 'XyZ2018yAcCeSsi';

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../artoo')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongodbURI = 'mongodb://localhost:27017/artoo';
//let db;

mongoose.Promise = global.Promise;
mongoose.connect(mongodbURI)
  .then(db => {
    //db = db;
    console.log('Connected to MongoDB');

    setRoutes(app);

    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, '../artoo/index.html'));
    });





    if (!module.parent) {
      app.listen(app.get('port'), () => console.log(`Angular Full Stack listening on port ${app.get('port')}`));
    }
  })
  .catch(err => console.error(err));

export { app, mongodbURI, jwtSecret};

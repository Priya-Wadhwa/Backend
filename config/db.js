const mongoose = require('mongoose');
const DB = 'mongodb://127.0.0.1:27017/devhunt'|| "mongodb+srv://wpriya901:Dmurv9mVffxunORc@devhunt.gjxej9y.mongodb.net/";

mongoose
  .connect(DB)
  .then(() => console.log('db connected'))
  .catch((err) => console.log(err));

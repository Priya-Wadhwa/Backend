const mongoose = require('mongoose');
const DB = "mongodb+srv://wpriya901:Dmurv9mVffxunORc@devhunt.gjxej9y.mongodb.net/";

mongoose
  .connect(DB)
  .then(() => console.log('db connected'))
  .catch((err) => console.log(err));

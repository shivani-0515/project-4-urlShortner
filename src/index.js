const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const  mongoose  = require('mongoose');
const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Shiva-555:pBG3QBG7xnjaNHcZ@cluster0.zkrrd.mongodb.net/group12Database-DB"
    , {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(3001, function () {
    console.log('Express app running on port ' + 3001)
});

const express = require("express");
const bodyParser = require("body-parser");
const {default: mongoose} = require("mongoose");
const route = require("../routes/routes");
const app = express();

app.use(bodyParser.json());

let url = "mongodb+srv://urlShortner:YEJsATs3xmNKbsi3@cluster0.1gmi2hm.mongodb.net/group28Database"

let port = process.env.PORT || 3000; 

mongoose.connect(url, {useNewUrlParams: true})
    .then(() => console.log("MongoDb is connected")) 
    .catch((err) => console.log(err));
    
app.use("/", route);

app.listen(port, function () {
    console.log(`Express is listening on ${port}`);
});
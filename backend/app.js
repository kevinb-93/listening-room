const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const spotifyRoutes = require("./routes/spotify-routes");
const server = require("./utils/server");
const secret = require("./utils/secret");

const app = express();

app.use(express.static(__dirname + '/public')).use(cookieParser());

app.use('/api/spotify', spotifyRoutes);

mongoose.connect(secret.mongoCluster, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
app.listen(server.port, () => {
    console.log(`Listening on ${server.port}`) 
});
}).catch(err => {
    console.log(err);
});


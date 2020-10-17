const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const spotifyRoutes = require("./routes/spotify-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const server = require("./utils/server");
const secret = require("./utils/secret");

const app = express();

app.use(bodyParser.json()).use(express.static(__dirname + '/public')).use(cookieParser());

app.use('/api/spotify', spotifyRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


mongoose.connect(secret.mongoCluster, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
app.listen(server.port, () => {
    console.log(`Listening on ${server.port}`) 
});
}).catch(err => {
    console.log(err);
});


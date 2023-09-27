const express = require("express");
const cors = require("cors");
const { json } = require("express");
const admin = require("firebase-admin");
const getMessaging = admin.messaging;

process.env.GOOGLE_APPLICATION_CREDENTIALS;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "metamor-5c07b",
});

app.post("/send", function (req, res) {
  const receivedToken = req.body.fcmToken;

  const message = {
    notification: {
      title: "Notif",
      body: "This is a Test Notification",
    },
    token: "",
  };

  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
});

app.listen(4000, function () {
  console.log("Server started on port 4000");
});

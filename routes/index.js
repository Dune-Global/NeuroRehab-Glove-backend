const express = require("express");
const models = require("../models/data");
const router = express.Router();

// rest of your code

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/chart", (req, res, next) => {
  res.render("chart");
});

router.get("/dataview", (req, res, next) => {
  res.render("dataview");
});

//pass datato mongoDB
router.post("/insert/:fingerNumber", (req, res, next) => {
  console.log(req.body);
  const fingerNumber = req.params.fingerNumber; // Get the fingerNumber from the path
  const Model = models[`Finger${fingerNumber}`] || models.Wrist; // Select the correct model based on fingerNumber
  const newData = new Model({
    readings: req.body.readings.map((reading) => ({
      ...reading,
    })), // Add the fingerNumber to each reading
  });
  newData
    .save()
    .then((savedData) => {
      console.log(savedData);
      res.status(200).json(savedData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/latestData/:fingerNumber", async (req, res) => {
  const fingerNumber = req.params.fingerNumber; // Get the fingerNumber from the path
  const Model = models[`Finger${fingerNumber}`] || models.Wrist; // Select the correct model based on fingerNumber
  const latestData = await Model.find().sort({ currentDateTime: -1 }).limit(5);
  res.json(latestData);
});


module.exports = router;

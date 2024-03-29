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

async function getImprovementPercentage(fingerNumber) {
  const Model = models[`Finger${fingerNumber}`] || models.Wrist;
  const latestDocuments = await Model.find()
    .sort({ currentDateTime: -1 })
    .limit(2);

  if (latestDocuments.length > 0) {
    const averages = latestDocuments.map((document) => {
      if (document.readings && document.readings.length > 0) {
        const readings = document.readings;
        const total = readings.reduce(
          (acc, curr) => acc + Number(curr.readingValue),
          0
        );
        return total / readings.length;
      } else {
        return "No readings available";
      }
    });

    if (typeof averages[0] === "number" && typeof averages[1] === "number") {
      return ((averages[0] - averages[1]) / averages[1]) * 100;
    } else {
      return "No readings available for calculation";
    }
  } else {
    return "No documents available";
  }
}


router.get("/latestData/:fingerNumber", async (req, res) => {
  const numberOfRecords = 10;
  const fingerNumber = req.params.fingerNumber; // Get the fingerNumber from the path
  const Model = models[`Finger${fingerNumber}`] || models.Wrist; // Select the correct model based on fingerNumber
  const latestData = await Model.find().sort({ currentDateTime: -1 }).limit(numberOfRecords);

  // Transform the data
  let transformedData = {};
  let count = {};
  latestData.forEach(data => {
    const dateTime = new Date(data.currentDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    data.readings.forEach(reading => {
      if (!transformedData[reading.readingNumber]) {
        transformedData[reading.readingNumber] = { readingNumber: reading.readingNumber };
        count[reading.readingNumber] = 0;
      }
      if (count[reading.readingNumber] < numberOfRecords) {
        transformedData[reading.readingNumber][dateTime] = reading.readingValue;
        count[reading.readingNumber]++;
      }
    });
  });

  const improvementPercentage = await getImprovementPercentage(fingerNumber);

  res.json({ data: Object.values(transformedData), improvementPercentage });
});


module.exports = router;

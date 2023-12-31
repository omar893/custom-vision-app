const express = require('express');
const cors = require('cors');

//import isCar from './isCar';


const util = require('util');
const fs = require('fs');
const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

// retrieve environment variables
const trainingKey = process.env["VISION_TRAINING_KEY"];
const trainingEndpoint = process.env["VISION_TRAINING_ENDPOINT"];

const predictionKey = process.env["VISION_PREDICTION_KEY"];
const predictionResourceId = process.env["VISION_PREDICTION_RESOURCE_ID"];
const predictionEndpoint = process.env["VISION_PREDICTION_ENDPOINT"];

const publishIterationName = "classifyModel";
const setTimeoutPromise = util.promisify(setTimeout);

const credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": trainingKey } });
const trainer = new TrainingApi.TrainingAPIClient(credentials, trainingEndpoint);
const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } });
const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, predictionEndpoint);


const isCar = async (picture) => {
    const sampleProject = "ba7df439-29c2-4a24-9e91-8d6955b7cc93";
    console.log(picture);
    const testFile = picture.file; //fs.readFileSync(picture); 
    const results = await predictor.classifyImage(sampleProject, publishIterationName, testFile);
    console.log("Results:");
    return results.predictions[0];
}

const multer  = require('multer');
const upload = multer();

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.post('/api/predict', upload.single('file'),(req, res, next) => {
    res.send(isCar(req.body));

//   const process = spawn('node', ['custom-vision-script.js']);

//   let data = '';

//   process.stdout.on('data', (chunk) => {
//     data += chunk;
//   });

//   process.on('close', () => {
//     try {
//       const results = JSON.parse(data);
//       res.json(results);
//     } catch (error) {
//       console.error('Error parsing prediction results:', error);
//       res.status(500).json({ error: 'An error occurred while fetching prediction results.' });
//     }
//   });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

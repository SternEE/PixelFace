//install dependencies DONE
//import dependiencies DONE
//setup webcam and canvas DONE
//define references to those DONE
//load facemesh DONE
//detect function DONE
//drawing utilities
//load triangulation
//setup triangle path
//setup point drawing
//add drawmesh to detect function

import {useRef} from 'react';
//import logo from './logo.svg';
import './App.css';
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
//at one point i was suppose to use facemesh but this no longer is supported
//import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import {drawMesh} from "./utilities"


function App() {
  //set up references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  // load facemesh
  const runFacemesh = async () =>{
    if(webcamRef !== null){
    const net = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);

    setInterval(()=>{
      main(net);
    },150)
  }
  };
/*
  // detect function
  const detect = async(net) =>{
    //check to make sure webcame is ready for detection
    if(
      typeof webcamRef.currrent !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState===4){
        //get video properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
        //set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight
        //set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        //make detections
        const face = await net.estimateFaces(video);
        if (face){
          console.log(face)
        }
        // get canvas context for drawing
      }
  }

  runFacemesh();
  */
  async function main(model) {
    if(typeof webcamRef.currrent !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState===4){
        const video = webcamRef.current.video
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
        //set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight
        //set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
    // Load the MediaPipe Facemesh package.


    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
    // array of detected faces from the MediaPipe graph. If passing in a video
    // stream, a single prediction per frame will be returned.
    const predictions = await model.estimateFaces({
      input: video
    });
    predictions.forEach(prediction=>{
      //console.log(prediction.scaledMesh)
    }
    )
    if (predictions.length > 0) {
      const ctx = canvasRef.current.getContext("2d")
    drawMesh(predictions, ctx)
      /*
      `predictions` is an array of objects describing each detected face, for example:

      [
        {
          faceInViewConfidence: 1, // The probability of a face being present.
          boundingBox: { // The bounding box surrounding the face.
            topLeft: [232.28, 145.26],
            bottomRight: [449.75, 308.36],
          },
          mesh: [ // The 3D coordinates of each facial landmark.
            [92.07, 119.49, -17.54],
            [91.97, 102.52, -30.54],
            ...
          ],
          scaledMesh: [ // The 3D coordinates of each facial landmark, normalized.
            [322.32, 297.58, -17.54],
            [322.18, 263.95, -30.54]
          ],
          annotations: { // Semantic groupings of the `scaledMesh` coordinates.
            silhouette: [
              [326.19, 124.72, -3.82],
              [351.06, 126.30, -3.00],
              ...
            ],
            ...
          }
        }
      ]
      */

      for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].scaledMesh;
        const header = document.getElementById('webcam');
        const elementPosition = header.getBoundingClientRect()
        console.log(elementPosition)

        // Log facial keypoints.
        for (let i = 0; i < keypoints.length; i++) {
          const [x, y, z] = keypoints[i];

        //  console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
        }
      }
    }
  }
  }
  if (webcamRef){
  runFacemesh();
  }


  return (
    <div className="App">
      <header className="App-header">
      <Webcam id="webcam" ref={webcamRef} style={
        {
        position:"absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width: 640,
        height: 480
        }
      }/>
      <canvas ref={canvasRef}
      style={
        {
          position:"absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480
          }
      } />
      </header>
    </div>
  );
}

export default App;

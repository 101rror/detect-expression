import React, { useEffect, useRef } from 'react';
import './app.css';
import * as faceapi from 'face-api.js'


function App() {
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    });

    const resized = faceapi.resizeResults(detections,
      {
        width: 940,
        height: 650,
      });
    faceapi.draw.drawDetections(canvasRef.current, resized);
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);


  return (
    <div className="App">
      <img
        ref={imgRef}
        src="https://images.pexels.com/photos/6261906/pexels-photo-6261906.jpeg"
        alt=""
        width={940}
        height={650}
      />
      <canvas ref={canvasRef} width={940} height={650} />
    </div>
  );
}

export default App;
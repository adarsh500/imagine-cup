/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db, logout } from '../../firebase';
import { Camera } from 'react-camera-pro';
import '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import { drawMesh } from '../../utils';
// Adds the CPU backend.
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs-core';
import * as tflite from '@tensorflow/tfjs-tflite';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const camera = useRef(null);
  const [devices, setDevices] = useState([]);
  const [image, setImage] = useState(null);
  const [activeDeviceId, setActiveDeviceId] = useState('');
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = useState(false);
  const [result, setResult] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    age: null,
    sex: '',
    chol: null,
    fbs: null,
    trestbps: null,
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setPatientDetails({
      age: '',
      sex: '',
      trestbps: '',
      chol: '',
      fbs: '',
    });
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = new URLSearchParams(patientDetails).toString();
    try {
      // ('https://beat-cad-classifier.azurewebsites.net/predict?age=52&sex=1&trestbps=125&chol=225&fbs=0');

      const res = await fetch(
        `https://beat-cad-classifier.azurewebsites.net/predict?${query}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.log(err);
    }
    handleClose();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const functionPredict = async function () {
    //
    // Function to infer from tflite model
    //
    // (sorry for the really dirty code.)

    const tfliteModel = await tflite.loadTFLiteModel('./assets/model.tflite');
    const im = new Image();
    im.src = 'assets/1-556.JPG';
    im.onload = () => {
      let img = tf.browser.fromPixels(im, 4);

      const outputTensor = tf.tidy(() => {
        // Get pixels data from an image.
        // or use below method to fetch from a DOM object
        // whatever image you take please have them in BGR format
        // let img = tf.browser.fromPixels(document.querySelector('img'));
        // Resize and normalize:
        img = tf.image.resizeBilinear(img, [224, 224]);
        img = tf.sub(tf.div(tf.expandDims(img), 127.5), 1);

        // Run the inference.
        let outputTensor = tfliteModel.predict(img);

        // De-normalize the result.
        return tf.mul(tf.add(outputTensor, 1), 127.5);
      });

      console.log(outputTensor);
    };
  };

  const runFacemesh = useCallback(async () => {
    const net = await facemesh.load(
      facemesh.SupportedPackages.mediapipeFacemesh
    );
    setInterval(() => {
      detect(net);
    }, 10);
  }, []);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces({ input: video });
      console.log(face);

      // Get canvas context
      const ctx = canvasRef.current.getContext('2d');
      requestAnimationFrame(() => {
        drawMesh(face, ctx);
      });
    }
  };

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind === 'videoinput');
      setDevices(videoDevices);
      setActiveDeviceId(videoDevices[0].activeDeviceId);
    })();
  }, []);

  //don't remove this
  // useEffect(() => {
  //   runFacemesh();
  // }, [runFacemesh]);

  return (
    <div className={styles.dashboard}>
      {/* <nav className={styles.navbar}>
        <p>Logged in as {user?.email}</p>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </nav> */}

      {/* {functionPredict()} */}
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.camera}>
            <Camera
              ref={camera}
              aspectRatio="cover"
              videoSourceDeviceId={activeDeviceId}
              errorMessages={{
                noCameraAccessible:
                  'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied:
                  'Permission denied. Please refresh and give camera permission.',
                switchCamera:
                  'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
              }}
            />
          </div>
          <button
            className={styles.capture}
            onClick={() => {
              setImage(camera.current.takePhoto());
              handleOpen();
            }}
          >
            Start analysis
          </button>

          {!!result ? (
            !result[0] ? (
              <p
                style={{
                  color: 'green',
                  opacity: 0.5,
                }}
              >
                You are safe, the changes that you have CAD is{' '}
                {(result[1] * 100).toString().slice(0, 4)} %
              </p>
            ) : (
              <p
                style={{
                  color: 'orange',
                  opacity: 0.8,
                }}
              >
                You are unsafe, the changes that you have CAD is{' '}
                {(result[1] * 100).toString().slice(0, 4)} %
              </p>
            )
          ) : null}
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <div className={styles.login}>
          <h1 className={styles.title}>Enter patient details</h1>
          <div className={styles.form}>
            <div className={styles.inputField}>
              <label>Age</label>
              <div className={styles.input}>
                <input
                  type="text"
                  placeholder="37"
                  name="age"
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className={styles.inputField}>
              <label>Gender</label>
              <Select
                sx={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  marginTop: '8px',
                }}
                value={patientDetails.sex}
                label="Gender"
                onChange={handleChange}
                name="sex"
                size={'small'}
                fullWidth
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'1'}>Male</MenuItem>
                <MenuItem value={'0'}>Female</MenuItem>
              </Select>
            </div>

            <div className={styles.inputField}>
              <label>Resting blood pressure</label>
              <div className={styles.input}>
                <input
                  type="text"
                  placeholder="80"
                  name="trestbps"
                  value={patientDetails.trestbps}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className={styles.inputField}>
              <label>Do you have diabetes?</label>
              <Select
                sx={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  marginTop: '8px',
                }}
                value={patientDetails.fbs}
                label="Diabetes"
                onChange={handleChange}
                name="fbs"
                size={'small'}
                fullWidth
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'1'}>Yes</MenuItem>
                <MenuItem value={'0'}>No</MenuItem>
              </Select>
            </div>

            <div className={styles.inputField}>
              <label>Cholestrol levels</label>
              <div className={styles.input}>
                <input
                  type="text"
                  placeholder="123"
                  name="chol"
                  value={patientDetails.chol}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className={styles.ctaWrapper}>
              {/* <button
                className={styles.submit}
                onClick={() => setPreview(!preview)}
              >
                {preview ? 'Hide' : 'Preview scan'}
              </button> */}
              <button
                className={styles.submit}
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit
              </button>
              <button className={styles.submit} onClick={handleClose}>
                Cancel
              </button>
            </div>
            {/* {image && preview ? (
              <div className={styles.preview}>
                <img
                  // styles={{
                  //   maxWidth: '100%',
                  //   maxHeight: '100%',
                  //   objectFit: 'contain',
                  // }}
                  src={image}
                  alt="preview"
                />
              </div>
            ) : null} */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;

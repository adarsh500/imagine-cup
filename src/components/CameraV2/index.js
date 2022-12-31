import React, { useRef, useEffect, useState } from 'react';
import styles from './CameraV2.module.scss';

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: 'environment', width: 720, height: 480 },
};

const Camera = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  const getVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS);
      const video = videoRef.current;
      video.srcObject = stream;
      video.play();
    } catch (e) {
      console.log(e);
    }
  };

  const takePhoto = () => {
    const width = 580;
    const height = width / (4 / 3);
    const video = videoRef.current;
    const photo = photoRef.current;
    // const data = photo.toDataUrl('image/jpeg');

    photo.width = width;
    photo.height = height;

    const ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  };

  const closePhoto = () => {
    const photo = photoRef.current;
    const ctx = photo.getContext('2d');
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    <>
      <div className={styles.camera}>
        <video ref={videoRef}></video>
        <button onClick={takePhoto}>snap</button>
      </div>
      <div className={styles.result + hasPhoto ? styles.hasPhoto : ''}>
        <canvas ref={photoRef}></canvas>
        <button onClick={closePhoto}>close</button>
      </div>
    </>
  );
};

export default Camera;

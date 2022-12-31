// Adds the CPU backend.
import '@tensorflow/tfjs-backend-cpu';
// Import @tensorflow/tfjs-core
import * as tf from '@tensorflow/tfjs-core';
// Import @tensorflow/tfjs-tflite.
import * as tflite from '@tensorflow/tfjs-tflite';

const functionPredict = async function () {
  const tfliteModel = await tflite.loadTFLiteModel('./assets/model.tflite');

  const outputTensor = tf.tidy(() => {
    // Get pixels data from an image.
    let img = tf.browser.fromPixels(document.querySelector('img'));
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
functionPredict();

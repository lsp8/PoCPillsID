import React, {useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import {Camera} from 'expo-camera';
import {
  getModel,
  convertBase64ToTensor,
  startPrediction,
} from './src/helpers/tensor-helper';
import {cropPicture} from './src/helpers/image-helper';

const RESULT_MAPPING = ['Triangle', 'Circle', 'Square'];

export default function App() {
  const cameraRef = useRef();
  const [camera, setCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [presentedShape, setPresentedShape] = useState('');

  const handleCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setCamera(!camera);
    } else {
      console.log('Status:', status);
    }
  };

  const handleImageCapture = async () => {
    setIsProcessing(true);
    try {
      const imageData = await cameraRef.current.takePictureAsync({
        base64: true,
      });
      processImagePrediction(imageData);
    } catch {}
  };

  const processImagePrediction = async base64Image => {
    const croppedData = await cropPicture(base64Image, 300);
    const model = await getModel();
    const tensor = await convertBase64ToTensor(croppedData.base64);
    const prediction = await startPrediction(model, tensor);
    const highestPrediction = prediction.indexOf(
      Math.max.apply(null, prediction),
    );
    setPresentedShape(RESULT_MAPPING[highestPrediction]);
  };

  const handleCloseModal = () => {
    setIsProcessing(false);
    setPresentedShape('');
  };

  return (
    <View style={styles.container}>
      <Modal visible={isProcessing} transparent={true} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalText}>
            A forma atual é: {presentedShape}
          </Text>
          {presentedShape === '' && <ActivityIndicator size="large" />}
          <TouchableOpacity
            onPress={() => {
              handleCloseModal();
            }}>
            <Text style={styles.modalText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {camera && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.back}
          autoFocus={true}
        />
      )}
      {camera && (
        <View>
          <TouchableOpacity
            style={styles.camButton}
            onPress={() => handleImageCapture()}>
            <Text style={styles.camButtonText}>Capturar imagem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.camButton}
            onPress={() => setCamera(false)}>
            <Text style={styles.camButtonText}>Fechar Câmera</Text>
          </TouchableOpacity>
        </View>
      )}
      {!camera && (
        <View>
          <TouchableOpacity
            style={styles.camButton}
            onPress={() => handleCamera()}>
            <Text style={styles.camButtonText}>Abrir camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#09035c',
    flex: 1,
  },
  camera: {
    height: 300,
  },
  camButton: {
    borderRadius: 15,
    backgroundColor: '#36c0f7',
    width: '60%',
    height: '30%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  camButtonText: {
    fontSize: 20,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: 'white',
  },
  activityIndicator: {
    position: 'absolute',
    marginTop: '70%',
    zIndex: 1,
    alignSelf: 'center',
  },
  modal: {
    width: '90%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginTop: '20%',
  },
  modalText: {
    color: 'white',
    fontSize: 20,
  },
});

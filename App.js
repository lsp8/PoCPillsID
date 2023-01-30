import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Camera} from 'expo-camera';
import {
  getModel,
  convertBase64ToTensor,
  startPrediction,
} from './src/helpers/tensor-helper';
import {cropPicture} from './src/helpers/image-helper';

export default function App() {
  const RESULT_MAPPING = ['Filled', 'Empty'];
  const cameraRef = useRef();
  const [isProcessing, setIsProcessing] = useState(false);
  const [permission, setPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(false);

  const handleCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setCamera(!camera);
    } else {
      console.log('Status:', status);
    }
  };

  return (
    <View style={styles.container}>
      {camera && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.back}
          autoFocus={true}
        />
      )}

      <View>
        <TouchableOpacity style={styles.camButton} onPress={handleCamera}>
          <Text style={styles.camButtonText}>Câmera</Text>
        </TouchableOpacity>
      </View>
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
});

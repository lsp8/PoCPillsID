import React from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Camera, CameraType} from 'expo-camera';
import {useState} from 'react';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  function toggleCameraType() {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  return (
    <View style={styles.container}>
      <Camera type={type} style={styles.camera}>
        <View>
          <TouchableOpacity style={styles.camButton} onPress={toggleCameraType}>
            <Text style={styles.camButtonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#09035c',
    flex: 1,
    padding: 10,
  },
  camera: {
    height: '60%',
    justifyContent: 'flex-end',
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

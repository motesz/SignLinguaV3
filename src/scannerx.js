import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import Tts from 'react-native-tts';

import CameraScanner from "./components/camera";
import InputTypeAhead from "./components/input";
import MenuSection from "./components/menu";

const teststring = 'abcdefghijklmnopqrstuvwxyz'

const ScannerScreen = () => {

  const [detecting, setDetecting] = useState(false)
  const [cameraMode, setCameraMode] = useState('')
  const [outputValue, setOutputValue] = useState("")
  const [tempDetections, setTempDetections] = useState("")

  const [lastPrediction, setLastPrediction] = useState(null)
  const debounceTime = 300;
  const debounceTimeout = useRef(null)

  // Function to process prediction with debounce logic
  const processPrediction = (currentPrediction) => {
    return new Promise((resolve) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);  // Clear the previous timer
      }

      // Start a new timer for debounce
      debounceTimeout.current = setTimeout(() => {
        setLastPrediction(currentPrediction); 
        resolve(currentPrediction);  // Return the valid prediction
      }, debounceTime);
    });
  };

  const handleToggle = (recording) => {
    setDetecting(recording)
  }

  const handleSetValue = async (newValue) => {
    let result = await processPrediction(newValue)
    if(result){
      setOutputValue(result)
    }
  }

  const handleSwitch = (mode) => {
    setCameraMode(mode)
  }

  const handleSpeak = () => {
    Tts.speak(
      outputValue,  
      {
        androidParams: {
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      }
    )
  }

  const handleOnDetection = (value) => {
    setTempDetections(value)
    setOutputValue(outputValue + `${value}`)
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f8f8f9'}}>
      <View style={{flex: 4}}>
        <CameraScanner mode={cameraMode} detect={detecting} onDetected={handleOnDetection} />
      </View>
      <InputTypeAhead value={outputValue} setValue={handleSetValue}  />
      <MenuSection onSpeak={handleSpeak} onToggle={handleToggle} onSwitch={handleSwitch} />
    </View>
  )
}

export default ScannerScreen;
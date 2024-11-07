import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Tts from 'react-native-tts';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { useFrameProcessor } from "react-native-vision-camera";

import InputTypeAhead from "./components/input";
import MenuSection from "./components/menu";

const ScannerScreen = () => {

    const objectDetection = useTensorflowModel(require('./assets/model.tflite'))
    const model = objectDetection.state === "loaded" ? objectDetection.model : undefined
    const { resize } = useResizePlugin()

    const [cameraDevice, setCameraDevice] = useState(useCameraDevice('back'))
    const [outputValue, setOutputValue] = useState('')

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        if (model == null) return

        // 1. Resize 4k Frame to 192x192x3 using vision-camera-resize-plugin
        const resized = resize(frame, {
            scale: {
                width: 192,
                height: 192,
            },
            pixelFormat: 'rgb',
            dataType: 'uint8',
        })

        // 2. Run model with given input buffer synchronously
        const outputs = model.runSync([resized])

        // 3. Interpret outputs accordingly
        const detection_boxes = outputs[0]
        const detection_classes = outputs[1]
        const detection_scores = outputs[2]
        const num_detections = outputs[3]
        console.log(`Detected ${num_detections[0]} objects!`)

        for (let i = 0; i < detection_boxes.length; i += 4) {
            const confidence = detection_scores[i / 4]
            if (confidence > 0.7) {
                // 4. Draw a red box around the detected object!
                const left = detection_boxes[i]
                const top = detection_boxes[i + 1]
                const right = detection_boxes[i + 2]
                const bottom = detection_boxes[i + 3]
                // const rect = SkRect.Make(left, top, right, bottom)
                // canvas.drawRect(rect, SkColors.Red)
            }
        }
    }, [model])

    const handleSwitchCamera = () => {
        setCameraDevice(cameraDevice == 'back' ? useCameraDevice('front') : useCameraDevice('back'))
    }

    const handleStartStop = () => {

    }

    const handleSetValue = () => {

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

    return (
        <View style={{flex: 1}}>
            <View style={{flex: 4}}>
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={cameraDevice}
                    isActive={true}
                    frameProcessor={frameProcessor}
                />
            </View>
            <InputTypeAhead value={outputValue} setValue={handleSetValue}  />
            <MenuSection onSpeak={handleSpeak} onToggle={handleStartStop} onSwitch={handleSwitchCamera} />
        </View>
    )
}

export default ScannerScreen;
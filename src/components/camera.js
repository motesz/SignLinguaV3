import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import WebView from "react-native-webview";

import {webAppBaseUrl, trainDataModelID} from '../../app.json';

// const defaultLink = 'https://www.google.com';
// const webappurl = 'https://navajowhite-porpoise-541325.hostingersite.com/scan.php';
// const modelID = 'LSs-0jMd2';

const threshold = 1;

const CameraScanner = ({mode, detect, onDetected}) => {

  const [link, setLink] = useState(`${webAppBaseUrl}?id=${trainDataModelID}&threshold=${threshold}&camera=&detect=`)

  const handleOnDetect = (data) => {
    onDetected(data?.className)
  }

  useEffect(() => {
    setLink(`${webAppBaseUrl}?id=${trainDataModelID}&threshold=${threshold}&camera=${mode}&detect=${detect}`)
    console.log("Changing url: ", link)
  }, [mode, detect])

  return (
    <WebView 
      source={{uri: link || undefined}} 
      style={styles.view} 
      javaScriptEnabled={true} 
      mediaPlaybackRequiresUserAction={false} 
      onMessage={(e) => {
        console.log(e.nativeEvent.data)
        handleOnDetect(JSON.parse(e.nativeEvent.data))
      }}
    />
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1, 
    width: '100%', 
    height: '50%', 
    // backgroundColor: '#000'
  }
})

export default CameraScanner;
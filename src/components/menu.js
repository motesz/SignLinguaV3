import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon, Text } from '@ui-kitten/components'

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const IconSet = {
  speak: () => (<MaterialIcons name='record-voice-over' color="#7151d4" size={20} />),
  switch: () => (<MaterialIcons name='flip-camera-ios' color="#7151d4" size={20} />),
  playOrPause: ({playing}) => {
    if(!playing) return <AntDesignIcon name='scan1' color="#fff" size={35} />
    else return <AntDesignIcon name='closecircleo' color="#fff" size={35} />
  }
}

const MenuSection = ({
  onSpeak = () => null,
  onToggle = () => null,
  onSwitch = () => null
}) => {

  const [toggled, setToggled] = useState(false)
  const [switchTo, setSwitchTo] = useState('')

  const defaultSwitchOptions = {
    front: 'user',
    back: 'environment'
  }

  const handleToggle = () => {
    let status = !toggled
    setToggled(status)
    onToggle(status)
  }

  const handleSwitch = () => {
    if(switchTo === 'user') setSwitchTo(defaultSwitchOptions.back)
    else setSwitchTo(defaultSwitchOptions.front)
    onSwitch(switchTo)
  }

  const handleSpeak = () => {
    onSpeak()
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 0.2}}></View>
      <View style={styles.col}>
        <TouchableOpacity onPress={handleSpeak} style={styles.btn}>
          {<IconSet.speak />}
          <Text style={styles.btnText}>Speak</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.col}>
        <View style={styles.centerBtnContainer}>
          <TouchableOpacity style={{...styles.btnCenter, backgroundColor: !toggled ? '#7151d4' : '#ff6721'}} onPress={handleToggle}>
            {<IconSet.playOrPause playing={toggled} />}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.col}>
        <TouchableOpacity style={styles.btn} onPress={handleSwitch}>
          {<IconSet.switch />}
          <Text style={styles.btnText}>Switch</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.2}}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0.6, 
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  btn: {
    padding: 8,
    // backgroundColor: '#5e69ee',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 10
  },
  centerBtnContainer: {
    flex: 1, 
    position: 'absolute', 
    padding: 10, 
    backgroundColor: '#fff', 
    width: 90, 
    height: 90, 
    zIndex: 1, 
    bottom: 5, 
    borderRadius: 40
  },
  btnCenter: {
    padding: 16,
    backgroundColor: '#7151d4',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35,
  },
  icon: {
    // width: 20, height: 20
  },
  btnText: {
    fontSize: 9,
    color: 'darkgray',
    marginTop: 0
  },
  centerBtn: {
    // width: 35, height: 35,
  }
})

export default MenuSection;
import { Icon, Text } from "@ui-kitten/components"
import React, { useEffect, useState, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown"

import Ionicon from 'react-native-vector-icons/Ionicons'

import {suggestionsApiUrl} from '../../app.json'

const InputTypeAhead = ({value, setValue}) => {

  const inputController = useRef(null)

  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState(null)

  const handleOnFocus = () => {
   setIsFocused(!isFocused) 
  }

  const handleSelectSuggestion = (item) => {
    if(!item) return
    const {title} = item
    setInputValue(title)
    setValue(title)
    inputController.current?.setInputText(title)
  }

  const handleDelete = () => {
    let newValue = inputValue.slice(0, inputValue.length - 1)
    setInputValue(newValue)
    setValue(newValue)
    inputController.current?.setInputText(newValue)
    if(newValue == ''){
      setSuggestions([])
    }
  }

  const fetchWords = async (input) => {

    if(input == '') {
      setSuggestions([])
      return
    }

    const response = await fetch(`${suggestionsApiUrl}?s=${input}&max=5`);
    const data = await response.json();
    const formatted = data.map((item, index) => {
      return {
        id: index,
        title: item.word
      }
    });
    setSuggestions(formatted);
  }

  useEffect(() => {
    if(value) {
      setInputValue(value)
      inputController.current?.setInputText(value)
    }
  }, [value])

  useEffect(() => {
    if(inputValue != ''){
      fetchWords(inputValue)
    }else if(inputValue == ''){
      setSuggestions([])
      setIsFocused(false)
    }
  }, [inputValue])

  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal: 10}}>
        <AutocompleteDropdown
          controller={controller => inputController.current = controller}
          dataSet={suggestions}
          debounce={600} 
          useFilter={false} // set false to prevent rerender twice
          textInputProps={{
            readOnly: true,
            placeholder: '',
            autoCorrect: false,
            autoCapitalize: 'none',
            style: {
              borderRadius: 25,
              backgroundColor: '#fff',
              color: '#383b42',
              paddingLeft: 18,
            },
          }}
          onSelectItem={handleSelectSuggestion}
          onClear={handleDelete}
          rightButtonsContainerStyle={{
            right: 8,
            height: 30,
            alignSelf: 'center',
          }}
          inputContainerStyle={{
            backgroundColor: '#fff',
            borderRadius: 25,
          }}
          suggestionsListContainerStyle={{
            backgroundColor: '#fff'
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => <Text style={{ color: '#383b42', padding: 15 }}>{item.title}</Text>}
          ItemSeparatorComponent={() => <View></View>}
          ClearIconComponent={<Ionicon name='backspace-outline' color="#383b42" size={18} />}
          inputHeight={50}
        />
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0.75,
    paddingTop: 8,
    fontSize: 18,
    backgroundColor: '#f8f8f9'
  },
  inputFieldContainer: {
    flex: 1,
    backgroundColor: '#f8f8f9',
    padding: 10,
    paddingBottom: 25
  },
  inputField: {
    flex: 1,
    paddingLeft: 9,
    paddingTop: 6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 8,
    elevation: 0.3
  },
  inputFieldText: {
    flex: 1,
    fontSize: 16,
    maxWidth: '90%',
    color: '#4d4d4d',
    fontFamily: 'Open Sans'
  },
  suggestionsField: {
    flex: 0.5
  },
  badge: {
    backgroundColor: '#3498db',
    paddingVertical: 1,
    paddingHorizontal: 8,
    margin: 5,
    borderRadius: 12,
    alignSelf: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
  },

})

export default InputTypeAhead;
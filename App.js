import 'react-native-gesture-handler';
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import { EvaIconsPack } from '@ui-kitten/eva-icons';

import ScannerScreen from './src/scanner';


export default () => {

  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <>
      <IconRegistry icons={[EvaIconsPack]}/>
        {/* <ThemeContext.Provider value={{ theme, toggleTheme }}> */}
          <ApplicationProvider {...eva} theme={eva[theme]}>
            <AutocompleteDropdownContextProvider>
              <ScannerScreen />
            </AutocompleteDropdownContextProvider>            
          </ApplicationProvider>
        {/* </ThemeContext.Provider> */}
      
    </>
  )

};
import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StackParamList} from 'src/types';
import HomeScreen from './src/screens/HomeScreen';
import WorkScreen from './src/screens/WorkScreen';

const Stack = createStackNavigator<StackParamList>();

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Work" component={WorkScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

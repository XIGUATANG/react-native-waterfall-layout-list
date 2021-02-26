import React from 'react';
import { View, Text } from 'react-native';
import Switch from './src/views/Switch';
import Home from './src/views/Home';

import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderBackButton,
  StackNavigationOptions,
  StackHeaderLeftButtonProps,
  TransitionPresets,
} from '@react-navigation/stack';

interface Props { }

const Stack = createStackNavigator();

const App = (props: Props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="card">
        <Stack.Screen options={{
          headerShown: false,
        }} name="Home" component={Home} />
        <Stack.Screen name="Switch" component={Switch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

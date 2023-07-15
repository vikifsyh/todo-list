import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import splashscreen from './screen/splashscreen';
import home from './screen/home';
import task from './screen/task';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="splashscreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="splashscreen" component={splashscreen} />
        <Stack.Screen name="home" component={home} />
        <Stack.Screen name="task" component={task} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

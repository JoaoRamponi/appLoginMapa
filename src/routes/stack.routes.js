
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Mapa from '../screens/Mapa';

import MapaDestino from '../screens/MapaDestino';

import Login from '../screens/Login';


const Stack = createStackNavigator();

function App(){
    return ( 
       <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>   
            <Stack.Screen name="Login" component={Login} />  
            <Stack.Screen name="Mapa" component={Mapa} />  
            <Stack.Screen name="MapaDestino" component={MapaDestino} />                   
         
        </Stack.Navigator>
        </NavigationContainer>
    )
}
export default App;


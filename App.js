// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/LoginScreen';
import FeedScreen from './pages/FeedScreen';
import DetalhesScreen from './pages/DetalhesSreen';
import HomeScreen from './pages/HomeScreen';
import LikedScreen from './pages/LikedScreen';
import PerfilScreen from './pages/ProfileScreen';
import InsertScreen from './pages/InsertScreen'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#045071',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Conta" component={PerfilScreen} options={{ title: 'Conta' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Catálogo' }} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes' }} />
        <Stack.Screen name="Curtidos" component={LikedScreen} options={{ title: 'Curtidos' }} />
        <Stack.Screen name="Insert" component={InsertScreen} options={{ title: 'Adicionar Camiseta' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
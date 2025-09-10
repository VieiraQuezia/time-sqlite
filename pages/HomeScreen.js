// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupDatabase } from '../database';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await setupDatabase();
        const data = await AsyncStorage.getItem('@usuario');
        if (data) {
          navigation.replace('Feed'); // Use replace to avoid stacking Home screen
        }
      } catch (e) {
        console.error('Erro ao inicializar banco de dados ou verificar login:', e);
        Alert.alert('Erro', 'Falha ao inicializar o aplicativo. Tente novamente.');
      } finally {
        setInitializing(false);
      }
    };
    initialize();
  }, [navigation]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Inicializando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://placehold.co/150x150/045071/FFFFFF?text=⚽' }}
          style={styles.logo}
        />
        <Text style={styles.title} variant="headlineLarge">
          Time de Craques
        </Text>
        <Text style={styles.subtitle} variant="bodyLarge">
          Sua loja oficial de camisetas
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={[styles.button, styles.buttonElevated]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Entrar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#045071',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#045071',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 12,
    marginTop: 10,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
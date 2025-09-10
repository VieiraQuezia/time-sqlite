// LikedScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LikedScreen = () => {
  const [likedShirts, setLikedShirts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const carregarCurtidos = async () => {
      try {
        const curtidos = await AsyncStorage.getItem('@likedShirts');
        if (curtidos !== null) {
          setLikedShirts(JSON.parse(curtidos));
        }
      } catch (e) {
        console.log('Erro ao carregar curtidos:', e);
      }
    };
    carregarCurtidos();
  }, []);

  const removerCurtido = (id) => {
    Alert.alert('Remover Curtido', 'Deseja remover esta camisa dos curtidos?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        onPress: async () => {
          const updatedLikes = likedShirts.filter((item) => item.id !== id);
          setLikedShirts(updatedLikes);
          try {
            await AsyncStorage.setItem('@likedShirts', JSON.stringify(updatedLikes));
          } catch (e) {
            console.log('Erro ao salvar curtidos:', e);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('Detalhes', {
          shirt: item,
          onLikeUpdated: (newLikedShirts) => setLikedShirts(newLikedShirts),
        })
      }
    >
      <Card.Cover source={ item.image}  />
      <Card.Content>
        <Title style={styles.cardTitle}>{item.name}</Title>
        <Paragraph style={styles.cardPrice}>R$ {item.price.toFixed(2)}</Paragraph>
      </Card.Content>
      <TouchableOpacity style={styles.removeButton} onPress={() => removerCurtido(item.id)}>
        <MaterialIcons name="delete" size={28} color="red" />
      </TouchableOpacity>
    </Card>
  );

  return (
    <LinearGradient colors={['#045071', '#ffffff']} style={styles.gradient}>
      <View style={styles.container}>
        {likedShirts.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma camisa curtida.</Text>
        ) : (
          <FlatList
            data={likedShirts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 15 },
  card: { marginBottom: 15, borderRadius: 15, elevation: 5, backgroundColor: 'rgba(255, 255, 255, 0.9)', position: 'relative' },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardPrice: { fontSize: 14, color: '#6200ee', marginVertical: 5 },
  list: { paddingBottom: 20 },
  removeButton: { position: 'absolute', top: 10, right: 10, zIndex: 20 },
  emptyText: { marginTop: 50, fontSize: 18, color: '#333', textAlign: 'center' },
});

export default LikedScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { getProdutos, setupDatabase } from '../database';

import CamisaGenerica from '../assets/camisas/camisaGenerica.jpg'

const FeedScreen = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(null);
  const [likedShirts, setLikedShirts] = useState([]);
  const [produtos, setProdutos] = useState([]); // lista original do banco
  const [filteredShirts, setFilteredShirts] = useState([]); // lista mostrada (filtrada)
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        await setupDatabase();
        const produtosData = await getProdutos();
        setProdutos(produtosData);
        setFilteredShirts(produtosData);

        const userData = await AsyncStorage.getItem('@usuario');
        if (userData) setUsuario(JSON.parse(userData));

        const curtidos = await AsyncStorage.getItem('@likedShirts');
        if (curtidos) setLikedShirts(JSON.parse(curtidos));
      } catch (error) {
        console.error('Error initializing FeedScreen:', error);
      }
    };
    initialize();
  }, []);

  // Busca local usando o array `produtos` (por nome OU por cor, case-insensitive)
  const pesquisar = () => {
    const term = searchTerm.trim().toLowerCase();

    if (term === '') {
      // Se campo vazio, reseta para lista completa
      setFilteredShirts(produtos);
      return;
    }

    const resultados = produtos.filter((item) => {
      const nameMatch =
        item.name && item.name.toString().toLowerCase().includes(term);

      // Normaliza colors: aceita array ou string "azul, branco"
      const colorsArray = Array.isArray(item.colors)
        ? item.colors
        : item.colors
        ? item.colors.toString().split(',').map((s) => s.trim())
        : [];

      const colorMatch = colorsArray.some((c) =>
        c.toString().toLowerCase().includes(term)
      );

      return nameMatch || colorMatch;
    });

    if (resultados.length === 0) {
      Alert.alert('Nenhum resultado', 'Nenhuma camiseta encontrada.');
    }

    setFilteredShirts(resultados);
  };

  const limparBusca = () => {
    setSearchTerm('');
    setFilteredShirts(produtos);
  };

 const renderItem = ({ item }) => {
  // Se não tiver imagem, usa a genérica
  const imageSource = !item.image
    ?  CamisaGenerica
    : item.image

    console.log(item.name + item.image)

    const priceNumber = Number(item.price) || 0;

    return (
      <Card
        style={styles.card}
        onPress={() =>
          navigation.navigate('Detalhes', {
            shirt: item,
            onLikeUpdated: (newLikedShirts) => setLikedShirts(newLikedShirts),
          })
        }
      >
        <Card.Cover source={imageSource} /> 
        <Card.Content>
          <Title style={styles.cardTitle}>{item.name}</Title>
          <Paragraph style={styles.cardPrice}>R$ {priceNumber.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  return (
    <LinearGradient colors={['#045071', '#ffffff']} style={styles.gradient}>
      <FlatList
        data={filteredShirts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {usuario && (
              <View style={styles.userHeader}>
                <TouchableOpacity
                  style={styles.userLogin}
                  onPress={() => navigation.navigate('Conta')}
                >
                  <Text style={styles.userName}>{usuario.nickname}</Text>
                  <Image
                    source={{
                      uri:
                        usuario.foto ||
                        'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                    }}
                    style={styles.userImage}
                  />
                </TouchableOpacity>
              </View>
            )}

            <ScrollView horizontal style={styles.header}>
              <View style={styles.headerButtons}>
                <Button
                  mode="contained"
                  icon="heart"
                  onPress={() => navigation.navigate('Curtidos')}
                  style={styles.actionButton}
                  labelStyle={styles.buttonLabel}
                >
                  Curtidas
                </Button>

                <Button
                  mode="contained"
                  icon="plus"
                  onPress={() => navigation.navigate('Insert')}
                  style={styles.actionButton}
                  labelStyle={styles.buttonLabel}
                >
                  Adicionar
                </Button>
              </View>
            </ScrollView>

            {/* Campo de busca único */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou cor"
                placeholderTextColor="grey"
                value={searchTerm}
                onChangeText={setSearchTerm}
                returnKeyType="search"
                onSubmitEditing={pesquisar}
              />
              <TouchableOpacity style={styles.searchButton} onPress={pesquisar}>
                <MaterialIcons name="search" size={24} color="#fff" />
              </TouchableOpacity>

              {searchTerm.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={limparBusca}>
                  <MaterialIcons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userHeader: { flexDirection: 'row', alignItems: 'center' },
  userLogin: { flexDirection: 'row', alignItems: 'center' },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 16,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#045071',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#0288d1',
    padding: 10,
    borderRadius: 10,
  },
  clearButton: {
    marginLeft: 8,
    backgroundColor: '#777',
    padding: 8,
    borderRadius: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardPrice: {
    fontSize: 14,
    color: '#6200ee',
    marginVertical: 5,
  },
  list: {
    paddingBottom: 20,
  },
});

export default FeedScreen;

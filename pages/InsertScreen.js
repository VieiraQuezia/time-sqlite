// InsertScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { insertProduto } from '../database';

const InsertScreen = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [cores, setCores] = useState('');
  const [tamanhos, setTamanhos] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const data = await AsyncStorage.getItem('@usuario');
        if (data !== null) {
          setUsuario(JSON.parse(data));
        }
      } catch (e) {
        console.log('Erro ao carregar usuário:', e);
      }
    };
    carregarUsuario();
  }, []);

  const handleInsert = async () => {
    if (!nome.trim() || !preco.trim() || !cores.trim() || !tamanhos.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const produto = {
        name: nome,
        price: parseFloat(preco),
        image: imagem || null,
        colors: cores.split(',').map(c => c.trim()),
        sizes: tamanhos.split(',').map(t => t.trim()),
        description: descricao || 'Camisa oficial',
      };
      await insertProduto(produto);
      Alert.alert('Sucesso!', `${nome} inserido(a) com sucesso.`);
      navigation.navigate('Feed');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao inserir o produto.');
      console.error('Erro ao inserir:', e);
    }
  };

  return (
    <LinearGradient colors={['#045071', '#ffffff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        {usuario && <Text style={styles.greetingText}>Olá, {usuario.nickname}!</Text>}
        <Text style={styles.title}>Adicionar Camiseta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da Camiseta"
          placeholderTextColor="grey"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Preço (ex: 299.90)"
          placeholderTextColor="grey"
          value={preco}
          onChangeText={setPreco}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="URL da Imagem (opcional)"
          placeholderTextColor="grey"
          value={imagem}
          onChangeText={setImagem}
        />
        <TextInput
          style={styles.input}
          placeholder="Cores (ex: Vermelho,Preto)"
          placeholderTextColor="grey"
          value={cores}
          onChangeText={setCores}
        />
        <TextInput
          style={styles.input}
          placeholder="Tamanhos (ex: P,M,G)"
          placeholderTextColor="grey"
          value={tamanhos}
          onChangeText={setTamanhos}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição (opcional)"
          placeholderTextColor="grey"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleInsert}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#fff' },
  greetingText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#fff' },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#045071',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#1976d2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default InsertScreen;
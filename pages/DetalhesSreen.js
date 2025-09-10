// DetalhesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  Card,
  Button,
  Chip,
  Text,
  Title,
  Paragraph,
  TextInput as PaperTextInput,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons';
import { updateProduto, deleteProduto } from '../database';

const DetalhesScreen = ({ route, navigation }) => {
  const { shirt, onLikeUpdated } = route.params;
  const [visivel, setVisivel] = useState(false);
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [likedShirts, setLikedShirts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(shirt.name);
  const [editedPrice, setEditedPrice] = useState(shirt.price.toString());
  const [editedImage, setEditedImage] = useState(shirt.image);
  const [editedColors, setEditedColors] = useState(shirt.colors.join(','));
  const [editedSizes, setEditedSizes] = useState(shirt.sizes.join(','));
  const [editedDescription, setEditedDescription] = useState(shirt.description);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const liked = likedShirts.some(item => item.id === shirt.id);

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

    const carregarCurtidos = async () => {
      try {
        const curtidosRaw = await AsyncStorage.getItem('@likedShirts');
        if (curtidosRaw !== null) {
          setLikedShirts(JSON.parse(curtidosRaw));
        } else {
          setLikedShirts([]);
        }
      } catch (e) {
        console.log('Erro ao carregar curtidos:', e);
      }
    };

    carregarUsuario();
    carregarCurtidos();
  }, []);

  const Likee = async (shirt) => {
    try {
      const curtidosRaw = await AsyncStorage.getItem('@likedShirts');
      const curtidos = curtidosRaw ? JSON.parse(curtidosRaw) : [];
      const isLiked = curtidos.some(item => item.id === shirt.id);
      let updatedLikes = [];

      if (isLiked) {
        updatedLikes = curtidos.filter(item => item.id !== shirt.id);
      } else {
        updatedLikes = [...curtidos, shirt];
      }

      await AsyncStorage.setItem('@likedShirts', JSON.stringify(updatedLikes));
      setLikedShirts(updatedLikes);
      if (onLikeUpdated) {
        onLikeUpdated(updatedLikes);
      }
    } catch (e) {
      console.log('Erro ao salvar curtidos:', e);
    }
  };

  const handleUpdate = async () => {
    try {
      const produtoAtualizado = {
        id: shirt.id,
        name: editedName,
        price: parseFloat(editedPrice),
        image: editedImage,
        colors: editedColors.split(',').map(c => c.trim()),
        sizes: editedSizes.split(',').map(t => t.trim()),
        description: editedDescription,
      };
      await updateProduto(produtoAtualizado);
      Alert.alert('Sucesso!', 'Camiseta atualizada com sucesso.');
      navigation.navigate('Feed');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao atualizar o produto.');
      console.error('Erro ao atualizar:', e);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja deletar a camiseta ${shirt.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await deleteProduto(shirt.id);
              Alert.alert('Sucesso!', 'Camiseta deletada com sucesso.');
              navigation.navigate('Feed');
            } catch (e) {
              Alert.alert('Erro', 'Falha ao deletar o produto.');
              console.error('Erro ao deletar:', e);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={["#ffffff", "#045071"]} style={styles.gradient}>
        {usuario && (
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{usuario.nickname}</Text>
            <Image
              source={{ uri: usuario.foto || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
              style={styles.userImage}
            />
          </View>
        )}
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            {isEditing ? (
              <View style={styles.editContainer}>
                <PaperTextInput
                  label="Nome"
                  value={editedName}
                  onChangeText={setEditedName}
                  style={styles.input}
                  mode="flat"
                />
                <PaperTextInput
                  label="Preço"
                  value={editedPrice}
                  onChangeText={setEditedPrice}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="flat"
                />
                <PaperTextInput
                  label="URL da Imagem"
                  value={editedImage}
                  onChangeText={setEditedImage}
                  style={styles.input}
                  mode="flat"
                />
                <PaperTextInput
                  label="Cores (ex: Vermelho,Preto)"
                  value={editedColors}
                  onChangeText={setEditedColors}
                  style={styles.input}
                  mode="flat"
                />
                <PaperTextInput
                  label="Tamanhos (ex: P,M,G)"
                  value={editedSizes}
                  onChangeText={setEditedSizes}
                  style={styles.input}
                  mode="flat"
                />
                <PaperTextInput
                  label="Descrição"
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  style={styles.input}
                  mode="flat"
                  multiline
                />
                <Button mode="contained" onPress={handleUpdate} style={styles.button}>
                  Salvar Alterações
                </Button>
              </View>
            ) : (
              <>
                <Card.Cover source={ shirt.image} style={styles.cardImage} />
                <Card.Content style={styles.content}>
                  <Title style={styles.cardTitle}>{shirt.name}</Title>
                  <Paragraph style={styles.cardDescription}>
                    {shirt.description || "Camisa oficial do time"}
                  </Paragraph>
                  <Text variant="titleMedium" style={styles.price}>
                    R$ {shirt.price.toFixed(2)}
                  </Text>
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    Tamanhos Disponíveis:
                  </Text>
                  <View style={styles.chipContainer}>
                    {shirt.sizes.map((size, i) => (
                      <Chip
                        key={i}
                        icon="tshirt-crew"
                        style={[styles.chip, selectedSize === size && { backgroundColor: "#045071" }]}
                        textStyle={selectedSize === size ? { color: "#fff" } : {}}
                        onPress={() => setSelectedSize(size)}
                      >
                        {size}
                      </Chip>
                    ))}
                  </View>
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    Cores Disponíveis:
                  </Text>
                  <View style={styles.chipContainer}>
                    {shirt.colors.map((color, i) => (
                      <Chip
                        key={i}
                        icon="palette"
                        style={[styles.chip, selectedColor === color && { backgroundColor: "#045071" }]}
                        textStyle={selectedColor === color ? { color: "#fff" } : {}}
                        onPress={() => setSelectedColor(color)}
                      >
                        {color}
                      </Chip>
                    ))}
                  </View>
                </Card.Content>
                <Card.Actions style={styles.actions}>
                  <Button
                    mode="contained"
                    onPress={() => setVisivel(true)}
                    style={styles.button}
                    disabled={!selectedSize || !selectedColor}
                  >
                    Comprar
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    style={styles.button}
                  >
                    Voltar
                  </Button>
                 
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => Likee(shirt)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name={liked ? "favorite" : "favorite-border"} size={40} color={liked ? "red" : "gray"} />
                  </TouchableOpacity>
                </Card.Actions>
                <Card.Actions>
 <Button
                    mode="contained"
                    onPress={() => setIsEditing(true)}
                    style={styles.button}
                  >
                    Editar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleDelete}
                    style={[styles.button, { backgroundColor: '#d32f2f' }]}
                  >
                    Deletar
                  </Button>
                </Card.Actions>
              </>
            )}
          </Card>
        </ScrollView>
        {visivel && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Endereço de Entrega</Text>
              <TextInput
                placeholder="Rua"
                style={styles.input}
                value={rua}
                onChangeText={setRua}
              />
              <TextInput
                placeholder="Bairro"
                style={styles.input}
                value={bairro}
                onChangeText={setBairro}
              />
              <TextInput
                placeholder="Número da Casa"
                keyboardType="numeric"
                style={styles.input}
                value={numero}
                onChangeText={setNumero}
              />
              <Button
                onPress={() => {
                  if (!rua || !bairro || !numero) {
                    Alert.alert("Erro", "Por favor, preencha todos os campos.");
                    return;
                  }
                  Alert.alert("Sucesso", `Pedido realizado!\nTamanho: ${selectedSize}\nCor: ${selectedColor}`);
                  setRua("");
                  setBairro("");
                  setNumero("");
                  setVisivel(false);
                }}
                style={styles.finalizeButton}
                mode="contained"
              >
                Finalizar Pedido
              </Button>
              <Button
                onPress={() => setVisivel(false)}
                style={styles.cancelButton}
                mode="outlined"
              >
                Cancelar
              </Button>
            </View>
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 15 },
  card: { borderRadius: 15, elevation: 5, backgroundColor: "rgba(255, 255, 255, 0.95)", marginTop: 60 },
  cardImage: { borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  content: { padding: 15 },
  cardTitle: { fontWeight: "bold", fontSize: 20, color: "#212121" },
  cardDescription: { marginVertical: 10, color: "#555555" },
  price: { fontSize: 18, fontWeight: "bold", color: "#6200ee", marginVertical: 10 },
  sectionTitle: { marginTop: 15, marginBottom: 5, fontWeight: "600", color: "#212121" },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 5 },
  chip: { marginRight: 5, marginBottom: 5, borderRadius: 10 },
  actions: { justifyContent: "space-around", padding: 10 },
  button: { borderRadius: 10, flex: 1, marginHorizontal: 5 },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: { width: "80%", backgroundColor: "white", borderRadius: 10, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginVertical: 10, paddingHorizontal: 10, height: 40 },
  finalizeButton: { marginTop: 10 },
  cancelButton: { marginTop: 10 },
  userHeader: { position: 'absolute', top: 10, right: 20, flexDirection: 'row', alignItems: 'center' },
  userName: { color: '#045071', fontWeight: 'bold', marginRight: 10, fontSize: 16 },
  userImage: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#fff' },
  likeButton: { marginLeft: 10 },
  editContainer: { padding: 15 },
});

export default DetalhesScreen;
//PerfilScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(null);
  const [modal1, setmodal1] = useState(false);

  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const data = await AsyncStorage.getItem('@usuario');
          const user = JSON.parse(data);
          setUsuario(user);
          setUsername(user.username);
          setNickname(user.nickname);
        
      } catch (e) {
        console.log('Erro ao carregar usuário:', e);
      }
    };
    carregarUsuario();
  }, []);

  const abrirModalEdicao = () => {
    setUsername(usuario.username);
    setNickname(usuario.nickname);
    setmodal1(true);
  };

  const salvarPerfil = async () => {
    if (!username.trim()) {
      Alert.alert('Erro', 'O nome de usuário não pode ficar vazio.');
      return;
    }
    const updatedUser  = { ...usuario, username, nickname };
    try {
      await AsyncStorage.setItem('@usuario', JSON.stringify(updatedUser ));
      setUsuario(updatedUser );
      setmodal1(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
      console.log(e);
    }
  };

  if (!usuario) {
    return (
      <LinearGradient colors={['#045071', '#ffffff']} style={styles.gradient}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#045071', '#ffffff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Feed')}>
  <Text style={styles.backButtonText}>Voltar</Text>
</TouchableOpacity>

        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{usuario.username}</Text>
          <Text style={styles.nickname}>@{usuario.nickname}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonEdit} onPress={abrirModalEdicao}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonConfig}
            onPress={() =>
              Alert.alert('Configurações', 'Em manutenção')
            }
          >
            <Text style={styles.buttonText}>Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonChangePassword}
            onPress={() =>
              Alert.alert('Alterar Senha', 'Em manutenção')
            }
          >
            <Text style={styles.buttonText}>Alterar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonLogout}
            onPress={() => {
              AsyncStorage.removeItem('@usuario');
              navigation.navigate('Login');
            }}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de edição */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal1}
          onRequestClose={() => setmodal1(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome de usuário"
                  placeholderTextColor="grey"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nickname"
                  placeholderTextColor="grey"
                  value={nickname}
                  onChangeText={setNickname}
                  autoCapitalize="none"
                />
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.buttonSave} onPress={salvarPerfil}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  onPress={() => setmodal1(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  nickname: {
    fontSize: 18,
    color: '#d0e8f2',
    marginTop: 4,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonEdit: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  buttonConfig: {
    backgroundColor: '#0288d1',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  buttonChangePassword: {
    backgroundColor: '#fbc02d',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  buttonLogout: {
    backgroundColor: '#d32f2f',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  buttonSave: {
    backgroundColor: '#388e3c',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  buttonCancel: {
    backgroundColor: '#757575',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  backButton: {
  position: 'absolute',
  top: 40, 
  left: 20, 
  backgroundColor: '#1976d2',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
},
backButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});

export default ProfileScreen;

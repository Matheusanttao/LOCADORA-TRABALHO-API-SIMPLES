import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRental } from '../context/RentalContext';

export default function AddFilmeScreen({ navigation }) {
  const { createFilme, loading } = useRental();
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [ano, setAno] = useState('');

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o título do filme.');
      return;
    }

    if (!genero.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o gênero do filme.');
      return;
    }

    const anoNumero = parseInt(ano);
    if (!ano || isNaN(anoNumero) || anoNumero < 1900 || anoNumero > new Date().getFullYear() + 1) {
      Alert.alert('Erro', 'Por favor, insira um ano válido.');
      return;
    }

    try {
      await createFilme(titulo.trim(), genero.trim(), anoNumero);
      Alert.alert('Sucesso', 'Filme adicionado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            setTitulo('');
            setGenero('');
            setAno('');
            navigation.goBack();
          }
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao adicionar filme.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>➕ Adicionar Filme</Text>
        <Text style={styles.subtitle}>Preencha os dados do novo filme</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título do Filme *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: O Poderoso Chefão"
            value={titulo}
            onChangeText={setTitulo}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gênero *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Drama, Ação, Comédia..."
            value={genero}
            onChangeText={setGenero}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ano de Lançamento *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1972"
            value={ano}
            onChangeText={setAno}
            keyboardType="numeric"
            maxLength={4}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Adicionar Filme</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.buttonTextSecondary}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#e91e63',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonTextSecondary: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});


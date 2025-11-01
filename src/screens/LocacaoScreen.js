import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import SimplePicker from '../components/SimplePicker';
import { useRental } from '../context/RentalContext';

export default function LocacaoScreen({ navigation }) {
  const {
    clientes,
    filmesDisponiveis,
    loading,
    fetchClientes,
    fetchFilmesDisponiveis,
    createLocacao,
  } = useRental();

  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedFilme, setSelectedFilme] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClientes();
      fetchFilmesDisponiveis();
    });

    fetchClientes();
    fetchFilmesDisponiveis();

    return unsubscribe;
  }, [navigation, fetchClientes, fetchFilmesDisponiveis]);

  const handleSubmit = async () => {
    if (!selectedCliente) {
      Alert.alert('Erro', 'Por favor, selecione um cliente.');
      return;
    }

    if (!selectedFilme) {
      Alert.alert('Erro', 'Por favor, selecione um filme disponível.');
      return;
    }

    try {
      await createLocacao(parseInt(selectedCliente), parseInt(selectedFilme));
      Alert.alert('Sucesso', 'Locação registrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedCliente('');
            setSelectedFilme('');
            fetchFilmesDisponiveis();
            fetchClientes();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao registrar locação.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📥 Registrar Locação</Text>
        <Text style={styles.subtitle}>Selecione o cliente e o filme para locação</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cliente *</Text>
          {clientes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('AddCliente')}
              >
                <Text style={styles.linkText}>Cadastrar Cliente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <SimplePicker
              items={clientes.map((cliente) => ({
                label: `${cliente.nome} (${cliente.email})`,
                value: cliente.id.toString(),
              }))}
              selectedValue={selectedCliente}
              onValueChange={setSelectedCliente}
              placeholder="Selecione um cliente..."
              disabled={loading}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Filme Disponível *</Text>
          {filmesDisponiveis.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum filme disponível.</Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('AddFilme')}
              >
                <Text style={styles.linkText}>Adicionar Filme</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <SimplePicker
              items={filmesDisponiveis.map((filme) => ({
                label: `${filme.titulo} (${filme.genero})`,
                value: filme.id.toString(),
              }))}
              selectedValue={selectedFilme}
              onValueChange={setSelectedFilme}
              placeholder="Selecione um filme..."
              disabled={loading}
            />
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (loading || !selectedCliente || !selectedFilme) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !selectedCliente || !selectedFilme}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar Locação</Text>
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
  emptyState: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  linkButton: {
    marginTop: 8,
  },
  linkText: {
    color: '#e91e63',
    fontSize: 14,
    fontWeight: '600',
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


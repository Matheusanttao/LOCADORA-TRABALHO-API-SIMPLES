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

export default function DevolucaoScreen({ navigation }) {
  const {
    locacoesAtivas,
    loading,
    fetchLocacoesAtivas,
    createDevolucao,
  } = useRental();

  const [selectedLocacao, setSelectedLocacao] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLocacoesAtivas();
    });

    fetchLocacoesAtivas();

    return unsubscribe;
  }, [navigation, fetchLocacoesAtivas]);

  const handleSubmit = async () => {
    if (!selectedLocacao) {
      Alert.alert('Erro', 'Por favor, selecione uma locação para devolver.');
      return;
    }

    Alert.alert(
      'Confirmar Devolução',
      'Deseja realmente registrar a devolução deste filme?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await createDevolucao(parseInt(selectedLocacao));
              Alert.alert('Sucesso', 'Devolução registrada com sucesso!', [
                {
                  text: 'OK',
                  onPress: () => {
                    setSelectedLocacao('');
                    fetchLocacoesAtivas();
                  },
                },
              ]);
            } catch (error) {
              Alert.alert('Erro', error.message || 'Erro ao registrar devolução.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📤 Registrar Devolução</Text>
        <Text style={styles.subtitle}>Selecione a locação a ser devolvida</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Locação Ativa *</Text>
          {locacoesAtivas.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma locação ativa no momento.</Text>
            </View>
          ) : (
            <SimplePicker
              items={locacoesAtivas.map((locacao) => ({
                label: `${locacao.cliente_nome} - ${locacao.filme_titulo} (${new Date(locacao.data_locacao).toLocaleDateString('pt-BR')})`,
                value: locacao.id.toString(),
              }))}
              selectedValue={selectedLocacao}
              onValueChange={setSelectedLocacao}
              placeholder="Selecione uma locação..."
              disabled={loading}
            />
          )}
        </View>

        {selectedLocacao && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Informações da Locação:</Text>
            {locacoesAtivas
              .find((l) => l.id.toString() === selectedLocacao)
              ?.data_locacao && (
              <Text style={styles.infoText}>
                Data de Locação: {new Date(
                  locacoesAtivas.find((l) => l.id.toString() === selectedLocacao)
                    .data_locacao
                ).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (loading || !selectedLocacao || locacoesAtivas.length === 0) &&
              styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !selectedLocacao || locacoesAtivas.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar Devolução</Text>
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
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
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


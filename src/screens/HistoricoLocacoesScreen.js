import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SimplePicker from '../components/SimplePicker';
import { useRental } from '../context/RentalContext';

export default function HistoricoLocacoesScreen({ navigation }) {
  const { clientes, loading, fetchClientes, fetchHistoricoCliente } = useRental();
  const [selectedCliente, setSelectedCliente] = useState('');
  const [historico, setHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClientes();
    });

    fetchClientes();

    return unsubscribe;
  }, [navigation, fetchClientes]);

  useEffect(() => {
    if (selectedCliente) {
      loadHistorico();
    } else {
      setHistorico([]);
    }
  }, [selectedCliente]);

  const loadHistorico = async () => {
    setLoadingHistorico(true);
    try {
      const data = await fetchHistoricoCliente(parseInt(selectedCliente));
      setHistorico(data || []);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao carregar histórico.');
      setHistorico([]);
    } finally {
      setLoadingHistorico(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.historicoCard}>
      <Text style={styles.filmeTitulo}>{item.titulo}</Text>
      <Text style={styles.filmeGenero}>📽️ {item.genero || 'Sem gênero'}</Text>
      <View style={styles.datesContainer}>
        <Text style={styles.date}>
          📅 Locado: {new Date(item.data_locacao).toLocaleDateString('pt-BR')}
        </Text>
        {item.data_devolucao ? (
          <Text style={[styles.date, styles.dateDevolvido]}>
            ✅ Devolvido: {new Date(item.data_devolucao).toLocaleDateString('pt-BR')}
          </Text>
        ) : (
          <Text style={[styles.date, styles.dateEmAndamento]}>
            ⏳ Em locação
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Histórico de Locações</Text>
        <Text style={styles.subtitle}>Selecione um cliente para ver seu histórico</Text>
      </View>

      <View style={styles.pickerContainer}>
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
          />
        )}
      </View>

      {loadingHistorico ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Carregando histórico...</Text>
        </View>
      ) : selectedCliente && historico.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Este cliente ainda não possui locações registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={historico}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            selectedCliente && historico.length > 0 ? (
              <Text style={styles.headerCount}>
                {historico.length} locação{historico.length !== 1 ? 'ões' : ''} encontrada{historico.length !== 1 ? 's' : ''}
              </Text>
            ) : null
          }
        />
      )}
    </View>
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
  pickerContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyState: {
    backgroundColor: '#f5f5f5',
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
  listContainer: {
    padding: 16,
  },
  headerCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '600',
  },
  historicoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filmeTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  filmeGenero: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  datesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateDevolvido: {
    color: '#4caf50',
    fontWeight: '600',
  },
  dateEmAndamento: {
    color: '#ff9800',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
});


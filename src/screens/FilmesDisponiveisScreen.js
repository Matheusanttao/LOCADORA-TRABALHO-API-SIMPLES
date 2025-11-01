import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRental } from '../context/RentalContext';

export default function FilmesDisponiveisScreen({ navigation }) {
  const { filmesDisponiveis, loading, error, fetchFilmesDisponiveis } = useRental();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFilmesDisponiveis();
    });

    fetchFilmesDisponiveis();

    return unsubscribe;
  }, [navigation, fetchFilmesDisponiveis]);

  const renderFilme = ({ item }) => (
    <TouchableOpacity
      style={styles.filmeCard}
      onPress={() => navigation.navigate('MovieDetail', { 
        movie: {
          id: item.id,
          title: item.titulo,
          genre: item.genero,
          releaseDate: item.ano?.toString() || '',
          rating: 0,
          synopsis: '',
          image: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=' + encodeURIComponent(item.titulo),
        }
      })}
    >
      <View style={styles.filmeInfo}>
        <Text style={styles.filmeTitulo}>{item.titulo}</Text>
        <Text style={styles.filmeGenero}>📽️ {item.genero || 'Sem gênero'}</Text>
        <Text style={styles.filmeAno}>📅 {item.ano || 'Sem ano'}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusDisponivel}>✓ Disponível</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && filmesDisponiveis.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Carregando filmes disponíveis...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFilmesDisponiveis}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Filmes Disponíveis</Text>
        <Text style={styles.headerSubtitle}>
          {filmesDisponiveis.length} filme{filmesDisponiveis.length !== 1 ? 's' : ''} disponível{filmesDisponiveis.length !== 1 ? 'eis' : ''}
        </Text>
      </View>

      {filmesDisponiveis.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum filme disponível no momento.</Text>
          <Text style={styles.emptySubtext}>Adicione filmes através do menu de gerenciamento.</Text>
        </View>
      ) : (
        <FlatList
          data={filmesDisponiveis}
          renderItem={renderFilme}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchFilmesDisponiveis}
              colors={['#e91e63']}
            />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  filmeCard: {
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
  filmeInfo: {
    flex: 1,
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
    marginBottom: 4,
  },
  filmeAno: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  statusDisponivel: {
    color: '#fff',
    fontSize: 12,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});


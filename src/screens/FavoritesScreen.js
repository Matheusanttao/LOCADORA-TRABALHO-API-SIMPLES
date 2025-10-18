import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useMovie } from '../context/MovieContext';

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFromFavorites } = useMovie();

  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('Movies', {
        screen: 'MovieDetail',
        params: { movie: item }
      })}
    >
      <Image source={{ uri: item.image }} style={styles.movieImage} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieGenre}>{item.genre}</Text>
        <Text style={styles.movieRating}>⭐ {item.rating}/10</Text>
        <Text style={styles.movieDate}>{item.releaseDate}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <Text style={styles.removeButtonText}>🗑️ Remover dos Favoritos</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💔</Text>
        <Text style={styles.emptyTitle}>Nenhum filme favorito</Text>
        <Text style={styles.emptySubtitle}>
          Adicione filmes aos seus favoritos navegando pela lista de filmes
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Movies')}
        >
          <Text style={styles.exploreButtonText}>Explorar Filmes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❤️ Meus Favoritos ({favorites.length})</Text>
      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  movieCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  movieImage: {
    width: 120,
    height: 180,
    resizeMode: 'cover',
  },
  movieInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  movieGenre: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  movieRating: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '600',
    marginBottom: 4,
  },
  movieDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#ffebee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e74c3c',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useMovie } from '../context/MovieContext';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen({ route, navigation }) {
  const { movie } = route.params;
  const { isFavorite, toggleFavorite } = useMovie();

  const handleToggleFavorite = () => {
    toggleFavorite(movie);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.image }} style={styles.movieImage} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        
        <View style={styles.movieInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gênero:</Text>
            <Text style={styles.infoValue}>{movie.genre}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de Lançamento:</Text>
            <Text style={styles.infoValue}>{movie.releaseDate}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Avaliação:</Text>
            <Text style={styles.infoValue}>⭐ {movie.rating}/10</Text>
          </View>
        </View>

        <View style={styles.synopsisContainer}>
          <Text style={styles.synopsisTitle}>Sinopse</Text>
          <Text style={styles.synopsis}>{movie.synopsis}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite(movie.id) && styles.favoriteButtonActive
          ]}
          onPress={handleToggleFavorite}
        >
          <Text style={[
            styles.favoriteButtonText,
            isFavorite(movie.id) && styles.favoriteButtonTextActive
          ]}>
            {isFavorite(movie.id) ? '❤️ Remover dos Favoritos' : '🤍 Adicionar aos Favoritos'}
          </Text>
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
  movieImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  movieInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  synopsisContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  synopsisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  synopsis: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'justify',
  },
  favoriteButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  favoriteButtonActive: {
    backgroundColor: '#e91e63',
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  favoriteButtonTextActive: {
    color: '#fff',
  },
});

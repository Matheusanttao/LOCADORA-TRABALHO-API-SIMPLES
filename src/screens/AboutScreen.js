import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function AboutScreen() {
  const handleOpenLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>🎬</Text>
          <Text style={styles.appName}>CineMax</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o App</Text>
          <Text style={styles.description}>
            O CineMax é um aplicativo de locadora digital que permite aos usuários 
            explorar um catálogo completo de filmes, visualizar detalhes, adicionar 
            aos favoritos e muito mais.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>🎬 Catálogo completo de filmes</Text>
            <Text style={styles.featureItem}>📱 Interface intuitiva e responsiva</Text>
            <Text style={styles.featureItem}>❤️ Sistema de favoritos</Text>
            <Text style={styles.featureItem}>🔍 Detalhes completos dos filmes</Text>
            <Text style={styles.featureItem}>⭐ Sistema de avaliações</Text>
            <Text style={styles.featureItem}>🔄 Atualização automática</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnologias Utilizadas</Text>
          <View style={styles.techList}>
            <Text style={styles.techItem}>React Native</Text>
            <Text style={styles.techItem}>Expo</Text>
            <Text style={styles.techItem}>React Navigation</Text>
            <Text style={styles.techItem}>Context API</Text>
            <Text style={styles.techItem}>FlatList</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desenvolvimento</Text>
          <Text style={styles.description}>
            Este aplicativo foi desenvolvido como parte de uma atividade prática 
            de React Native, demonstrando conceitos de navegação, gerenciamento 
            de estado e interface de usuário.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => handleOpenLink('mailto:contato@cinemax.com')}
          >
            <Text style={styles.linkText}>📧 contato@cinemax.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => handleOpenLink('https://github.com/cinemax')}
          >
            <Text style={styles.linkText}>🐙 GitHub</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 CineMax. Todos os direitos reservados.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  techItem: {
    backgroundColor: '#e91e63',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    marginBottom: 8,
  },
  linkButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#e91e63',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

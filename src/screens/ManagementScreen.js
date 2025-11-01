import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function ManagementScreen({ navigation }) {
  const menuItems = [
    {
      id: 1,
      title: '➕ Adicionar Filme',
      subtitle: 'Cadastrar novo filme no catálogo',
      icon: '🎬',
      screen: 'AddFilme',
      color: '#e91e63',
    },
    {
      id: 2,
      title: '👤 Registrar Cliente',
      subtitle: 'Cadastrar novo cliente',
      icon: '👥',
      screen: 'AddCliente',
      color: '#2196f3',
    },
    {
      id: 3,
      title: '📋 Filmes Disponíveis',
      subtitle: 'Ver lista de filmes disponíveis para locação',
      icon: '✅',
      screen: 'FilmesDisponiveis',
      color: '#4caf50',
    },
    {
      id: 4,
      title: '📥 Registrar Locação',
      subtitle: 'Registrar locação de filme',
      icon: '📥',
      screen: 'Locacao',
      color: '#ff9800',
    },
    {
      id: 5,
      title: '📤 Registrar Devolução',
      subtitle: 'Registrar devolução de filme',
      icon: '📤',
      screen: 'Devolucao',
      color: '#9c27b0',
    },
    {
      id: 6,
      title: '📚 Histórico de Locações',
      subtitle: 'Ver histórico de locações por cliente',
      icon: '📚',
      screen: 'HistoricoLocacoes',
      color: '#607d8b',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Gerenciamento</Text>
        <Text style={styles.subtitle}>Gerencie filmes, clientes e locações</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Informações</Text>
        <Text style={styles.infoText}>
          Use este menu para gerenciar todas as operações do sistema de locadora.
          Todas as informações são salvas no banco de dados SQLite local.
        </Text>
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
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#999',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    margin: 16,
    padding: 16,
    borderRadius: 12,
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
    lineHeight: 20,
  },
});


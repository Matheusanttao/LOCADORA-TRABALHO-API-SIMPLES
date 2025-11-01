import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocadora } from '../context/LocadoraContext';
import { Ionicons } from '@expo/vector-icons';

export default function LocadoraScreen() {
  const {
    filmesDisponiveis,
    clientes,
    locacoesAtivas,
    loading,
    criarCliente,
    realizarLocacao,
    realizarDevolucao,
    loadAll,
  } = useLocadora();

  const [showAddCliente, setShowAddCliente] = useState(false);
  const [showAlugar, setShowAlugar] = useState(false);
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedFilme, setSelectedFilme] = useState(null);

  const handleAddCliente = async () => {
    if (!nomeCliente.trim() || !emailCliente.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await criarCliente(nomeCliente.trim(), emailCliente.trim());
      setNomeCliente('');
      setEmailCliente('');
      setShowAddCliente(false);
      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao cadastrar cliente');
    }
  };

  const handleAlugar = async () => {
    if (!selectedCliente || !selectedFilme) {
      Alert.alert('Erro', 'Selecione um cliente e um filme');
      return;
    }

    try {
      await realizarLocacao(selectedCliente.id, selectedFilme.id);
      setSelectedCliente(null);
      setSelectedFilme(null);
      setShowAlugar(false);
      Alert.alert('Sucesso', 'Filme alugado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao alugar filme');
    }
  };

  const handleDevolver = async (locacaoId) => {
    Alert.alert(
      'Confirmar Devolução',
      'Deseja realmente devolver este filme?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Devolver',
          onPress: async () => {
            try {
              await realizarDevolucao(locacaoId);
              Alert.alert('Sucesso', 'Filme devolvido com sucesso!');
            } catch (error) {
              Alert.alert('Erro', error.message || 'Erro ao devolver filme');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Seção de Filmes Disponíveis */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎬 Filmes Disponíveis ({filmesDisponiveis.length})</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadAll}
            >
              <Ionicons name="refresh" size={20} color="#e91e63" />
            </TouchableOpacity>
          </View>
          
          {filmesDisponiveis.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum filme disponível</Text>
          ) : (
            <FlatList
              data={filmesDisponiveis}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.filmeCard}>
                  <View style={styles.filmeInfo}>
                    <Text style={styles.filmeTitulo}>{item.titulo}</Text>
                    <Text style={styles.filmeDetalhes}>
                      {item.genero} • {item.ano}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Disponível</Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Seção de Clientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👥 Clientes ({clientes.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddCliente(true)}
            >
              <Ionicons name="add-circle" size={24} color="#e91e63" />
            </TouchableOpacity>
          </View>
          
          {clientes.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
          ) : (
            <FlatList
              data={clientes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.clienteCard}>
                  <View style={styles.clienteInfo}>
                    <Text style={styles.clienteNome}>{item.nome}</Text>
                    <Text style={styles.clienteEmail}>{item.email}</Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Seção de Locações Ativas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📋 Locações Ativas ({locacoesAtivas.length})
          </Text>
          
          {locacoesAtivas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma locação ativa</Text>
          ) : (
            <FlatList
              data={locacoesAtivas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.locacaoCard}>
                  <View style={styles.locacaoInfo}>
                    <Text style={styles.locacaoFilme}>{item.filme_titulo}</Text>
                    <Text style={styles.locacaoCliente}>
                      Cliente: {item.cliente_nome}
                    </Text>
                    <Text style={styles.locacaoData}>
                      Locado em: {item.data_locacao}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.devolverButton}
                    onPress={() => handleDevolver(item.id)}
                  >
                    <Text style={styles.devolverText}>Devolver</Text>
                  </TouchableOpacity>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Botão para Alugar Filme */}
        <TouchableOpacity
          style={styles.alugarButton}
          onPress={() => {
            if (clientes.length === 0) {
              Alert.alert('Aviso', 'Cadastre pelo menos um cliente primeiro');
              return;
            }
            if (filmesDisponiveis.length === 0) {
              Alert.alert('Aviso', 'Não há filmes disponíveis para locação');
              return;
            }
            setShowAlugar(true);
          }}
        >
          <Ionicons name="film-outline" size={24} color="#fff" />
          <Text style={styles.alugarButtonText}>Alugar Filme</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Adicionar Cliente */}
      <Modal
        visible={showAddCliente}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddCliente(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Cliente</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nomeCliente}
              onChangeText={setNomeCliente}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={emailCliente}
              onChangeText={setEmailCliente}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddCliente(false);
                  setNomeCliente('');
                  setEmailCliente('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddCliente}
              >
                <Text style={styles.confirmButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Alugar Filme */}
      <Modal
        visible={showAlugar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAlugar(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alugar Filme</Text>
            
            <Text style={styles.label}>Selecione o Cliente:</Text>
            <FlatList
              data={clientes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.selectItem,
                    selectedCliente?.id === item.id && styles.selectItemActive
                  ]}
                  onPress={() => setSelectedCliente(item)}
                >
                  <Text style={styles.selectItemText}>{item.nome}</Text>
                  {selectedCliente?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#e91e63" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.selectList}
            />
            
            <Text style={[styles.label, { marginTop: 20 }]}>Selecione o Filme:</Text>
            <FlatList
              data={filmesDisponiveis}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.selectItem,
                    selectedFilme?.id === item.id && styles.selectItemActive
                  ]}
                  onPress={() => setSelectedFilme(item)}
                >
                  <Text style={styles.selectItemText}>
                    {item.titulo} ({item.ano})
                  </Text>
                  {selectedFilme?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#e91e63" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.selectList}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAlugar(false);
                  setSelectedCliente(null);
                  setSelectedFilme(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  (!selectedCliente || !selectedFilme) && styles.disabledButton
                ]}
                onPress={handleAlugar}
                disabled={!selectedCliente || !selectedFilme}
              >
                <Text style={styles.confirmButtonText}>Alugar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 4,
  },
  addButton: {
    padding: 4,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
  filmeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filmeInfo: {
    flex: 1,
  },
  filmeTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  filmeDetalhes: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  clienteCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clienteEmail: {
    fontSize: 14,
    color: '#666',
  },
  locacaoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locacaoInfo: {
    flex: 1,
  },
  locacaoFilme: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locacaoCliente: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  locacaoData: {
    fontSize: 12,
    color: '#999',
  },
  devolverButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  devolverText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  alugarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e91e63',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  alugarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectList: {
    maxHeight: 200,
  },
  selectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectItemActive: {
    borderColor: '#e91e63',
    backgroundColor: '#fff5f8',
  },
  selectItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#e91e63',
    marginLeft: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
});

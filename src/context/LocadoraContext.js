import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  seedLocadora,
  getAllFilmes,
  getFilmesDisponiveis,
  addFilme,
  getAllClientes,
  addCliente,
  updateCliente,
  deleteCliente,
  getAllLocacoes,
  getLocacoesAtivas,
  alugarFilme,
  devolverFilme,
} from '../database/database';

const LocadoraContext = createContext();

const initialState = {
  filmes: [],
  filmesDisponiveis: [],
  clientes: [],
  locacoes: [],
  locacoesAtivas: [],
  loading: false,
  error: null,
};

const locadoraReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FILMES':
      return { ...state, filmes: action.payload };
    case 'SET_FILMES_DISPONIVEIS':
      return { ...state, filmesDisponiveis: action.payload };
    case 'SET_CLIENTES':
      return { ...state, clientes: action.payload };
    case 'SET_LOCACOES':
      return { ...state, locacoes: action.payload };
    case 'SET_LOCACOES_ATIVAS':
      return { ...state, locacoesAtivas: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const LocadoraProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locadoraReducer, initialState);

  // Carrega todos os filmes
  const loadFilmes = useCallback(async () => {
    try {
      const filmes = await getAllFilmes();
      dispatch({ type: 'SET_FILMES', payload: filmes });
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch]);

  // Carrega filmes disponíveis
  const loadFilmesDisponiveis = useCallback(async () => {
    try {
      const filmes = await getFilmesDisponiveis();
      dispatch({ type: 'SET_FILMES_DISPONIVEIS', payload: filmes });
    } catch (error) {
      console.error('Erro ao carregar filmes disponíveis:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch]);

  // Carrega todos os clientes
  const loadClientes = useCallback(async () => {
    try {
      const clientes = await getAllClientes();
      dispatch({ type: 'SET_CLIENTES', payload: clientes });
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch]);

  // Carrega todas as locações
  const loadLocacoes = useCallback(async () => {
    try {
      const locacoes = await getAllLocacoes();
      dispatch({ type: 'SET_LOCACOES', payload: locacoes });
    } catch (error) {
      console.error('Erro ao carregar locações:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch]);

  // Carrega locações ativas
  const loadLocacoesAtivas = useCallback(async () => {
    try {
      const locacoes = await getLocacoesAtivas();
      dispatch({ type: 'SET_LOCACOES_ATIVAS', payload: locacoes });
    } catch (error) {
      console.error('Erro ao carregar locações ativas:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch]);

  // Adiciona um filme
  const criarFilme = async (titulo, genero, ano) => {
    try {
      await addFilme(titulo, genero, ano);
      await loadFilmes();
      await loadFilmesDisponiveis();
    } catch (error) {
      console.error('Erro ao criar filme:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Adiciona um cliente
  const criarCliente = async (nome, email) => {
    try {
      await addCliente(nome, email);
      await loadClientes();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Atualiza um cliente
  const atualizarCliente = async (id, nome, email) => {
    try {
      await updateCliente(id, nome, email);
      await loadClientes();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Remove um cliente
  const removerCliente = async (id) => {
    try {
      await deleteCliente(id);
      await loadClientes();
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Aluga um filme
  const realizarLocacao = async (clienteId, filmeId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await alugarFilme(clienteId, filmeId);
      await loadFilmes();
      await loadFilmesDisponiveis();
      await loadLocacoes();
      await loadLocacoesAtivas();
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Erro ao realizar locação:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Devolve um filme
  const realizarDevolucao = async (locacaoId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await devolverFilme(locacaoId);
      await loadFilmes();
      await loadFilmesDisponiveis();
      await loadLocacoes();
      await loadLocacoesAtivas();
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Erro ao realizar devolução:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Carrega todos os dados
  const loadAll = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await Promise.all([
        loadFilmes(),
        loadFilmesDisponiveis(),
        loadClientes(),
        loadLocacoes(),
        loadLocacoesAtivas(),
      ]);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadFilmes, loadFilmesDisponiveis, loadClientes, loadLocacoes, loadLocacoesAtivas]);

  // Inicializa dados da locadora
  useEffect(() => {
    const initialize = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await seedLocadora();
        await loadAll();
      } catch (error) {
        console.error('Erro ao inicializar locadora:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initialize();
  }, [loadAll]);

  const value = {
    ...state,
    loadAll,
    criarFilme,
    criarCliente,
    atualizarCliente,
    removerCliente,
    realizarLocacao,
    realizarDevolucao,
    loadFilmes,
    loadFilmesDisponiveis,
    loadClientes,
    loadLocacoes,
    loadLocacoesAtivas,
  };

  return (
    <LocadoraContext.Provider value={value}>
      {children}
    </LocadoraContext.Provider>
  );
};

export const useLocadora = () => {
  const context = useContext(LocadoraContext);
  if (!context) {
    throw new Error('useLocadora deve ser usado dentro de um LocadoraProvider');
  }
  return context;
};

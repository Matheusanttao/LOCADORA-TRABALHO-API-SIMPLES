import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  addFilme,
  getAllFilmes,
  getFilmesDisponiveis,
  getFilmeById,
  updateFilmeDisponibilidade,
  addCliente,
  getAllClientes,
  getClienteById,
  registrarLocacao,
  registrarDevolucao,
  getHistoricoLocacoesCliente,
  getLocacoesAtivas,
  getAllLocacoes,
} from '../database/database';

const RentalContext = createContext();

const initialState = {
  filmes: [],
  filmesDisponiveis: [],
  clientes: [],
  locacoesAtivas: [],
  todasLocacoes: [],
  loading: false,
  error: null,
};

const rentalReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILMES':
      return { ...state, filmes: action.payload, loading: false };
    case 'SET_FILMES_DISPONIVEIS':
      return { ...state, filmesDisponiveis: action.payload, loading: false };
    case 'ADD_FILME':
      return {
        ...state,
        filmes: [...state.filmes, action.payload],
        filmesDisponiveis: action.payload.disponivel === 1
          ? [...state.filmesDisponiveis, action.payload]
          : state.filmesDisponiveis,
        loading: false,
      };
    case 'SET_CLIENTES':
      return { ...state, clientes: action.payload, loading: false };
    case 'ADD_CLIENTE':
      return {
        ...state,
        clientes: [...state.clientes, action.payload],
        loading: false,
      };
    case 'SET_LOCACOES_ATIVAS':
      return { ...state, locacoesAtivas: action.payload, loading: false };
    case 'SET_TODAS_LOCACOES':
      return { ...state, todasLocacoes: action.payload, loading: false };
    case 'ADD_LOCACAO':
      return {
        ...state,
        locacoesAtivas: [...state.locacoesAtivas, action.payload],
        todasLocacoes: [...state.todasLocacoes, action.payload],
        loading: false,
      };
    case 'UPDATE_LOCACAO':
      return {
        ...state,
        locacoesAtivas: state.locacoesAtivas.filter(
          (loc) => loc.id !== action.payload.id
        ),
        todasLocacoes: state.todasLocacoes.map((loc) =>
          loc.id === action.payload.id
            ? { ...loc, data_devolucao: action.payload.data_devolucao }
            : loc
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export const RentalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rentalReducer, initialState);

  // ==================== OPERAÇÕES COM FILMES ====================

  const fetchFilmes = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const filmes = await getAllFilmes();
      dispatch({ type: 'SET_FILMES', payload: filmes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const fetchFilmesDisponiveis = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const filmes = await getFilmesDisponiveis();
      dispatch({ type: 'SET_FILMES_DISPONIVEIS', payload: filmes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const createFilme = useCallback(async (titulo, genero, ano) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const filme = await addFilme(titulo, genero, ano);
      dispatch({ type: 'ADD_FILME', payload: filme });
      // Atualiza a lista de filmes disponíveis após adicionar
      const filmes = await getFilmesDisponiveis();
      dispatch({ type: 'SET_FILMES_DISPONIVEIS', payload: filmes });
      return filme;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const getFilme = useCallback(async (id) => {
    try {
      return await getFilmeById(id);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  // ==================== OPERAÇÕES COM CLIENTES ====================

  const fetchClientes = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const clientes = await getAllClientes();
      dispatch({ type: 'SET_CLIENTES', payload: clientes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const createCliente = useCallback(async (nome, email) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cliente = await addCliente(nome, email);
      dispatch({ type: 'ADD_CLIENTE', payload: cliente });
      return cliente;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const getCliente = useCallback(async (id) => {
    try {
      return await getClienteById(id);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  // ==================== OPERAÇÕES COM LOCAÇÕES ====================

  const fetchLocacoesAtivas = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const locacoes = await getLocacoesAtivas();
      dispatch({ type: 'SET_LOCACOES_ATIVAS', payload: locacoes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const fetchTodasLocacoes = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const locacoes = await getAllLocacoes();
      dispatch({ type: 'SET_TODAS_LOCACOES', payload: locacoes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const createLocacao = useCallback(async (clienteId, filmeId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const locacao = await registrarLocacao(clienteId, filmeId);
      
      // Atualiza a lista de filmes disponíveis
      const filmes = await getFilmesDisponiveis();
      dispatch({ type: 'SET_FILMES_DISPONIVEIS', payload: filmes });
      
      // Atualiza a lista de locações ativas
      const locacoes = await getLocacoesAtivas();
      dispatch({ type: 'SET_LOCACOES_ATIVAS', payload: locacoes });
      
      dispatch({ type: 'ADD_LOCACAO', payload: locacao });
      return locacao;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const createDevolucao = useCallback(async (locacaoId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const devolucao = await registrarDevolucao(locacaoId);
      
      // Atualiza a lista de filmes disponíveis
      const filmes = await getFilmesDisponiveis();
      dispatch({ type: 'SET_FILMES_DISPONIVEIS', payload: filmes });
      
      // Atualiza a lista de locações ativas
      const locacoes = await getLocacoesAtivas();
      dispatch({ type: 'SET_LOCACOES_ATIVAS', payload: locacoes });
      
      dispatch({ type: 'UPDATE_LOCACAO', payload: devolucao });
      return devolucao;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const fetchHistoricoCliente = useCallback(async (clienteId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const historico = await getHistoricoLocacoesCliente(clienteId);
      dispatch({ type: 'SET_LOADING', payload: false });
      return historico;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const value = {
    ...state,
    // Filmes
    fetchFilmes,
    fetchFilmesDisponiveis,
    createFilme,
    getFilme,
    // Clientes
    fetchClientes,
    createCliente,
    getCliente,
    // Locações
    fetchLocacoesAtivas,
    fetchTodasLocacoes,
    createLocacao,
    createDevolucao,
    fetchHistoricoCliente,
  };

  return (
    <RentalContext.Provider value={value}>
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental deve ser usado dentro de um RentalProvider');
  }
  return context;
};


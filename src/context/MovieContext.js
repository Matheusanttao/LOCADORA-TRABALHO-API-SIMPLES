import React, { createContext, useContext, useReducer, useCallback } from 'react';

const MovieContext = createContext();

const initialState = {
  movies: [],
  favorites: [],
  loading: false,
  error: null,
};

const movieReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(movie => movie.id !== action.payload),
      };
    case 'TOGGLE_FAVORITE': {
      const isFavorite = state.favorites.some(movie => movie.id === action.payload.id);
      if (isFavorite) {
        return {
          ...state,
          favorites: state.favorites.filter(movie => movie.id !== action.payload.id),
        };
      } else {
        return {
          ...state,
          favorites: [...state.favorites, action.payload],
        };
      }
    }
    default:
      return state;
  }
};

export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  const fetchMovies = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Dados mockados para simular uma API
      const mockMovies = [
        {
          id: 1,
          title: 'O Poderoso Chefão',
          genre: 'Drama',
          synopsis: 'A história da família Corleone, uma das mais poderosas famílias do crime organizado nos Estados Unidos.',
          releaseDate: '1972-03-24',
          rating: 9.2,
          image: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=O+Poderoso+Chefão',
        },
        {
          id: 2,
          title: 'Pulp Fiction',
          genre: 'Crime',
          synopsis: 'As vidas de dois assassinos da máfia, um boxeador, a esposa de um gângster e um par de bandidos se entrelaçam em quatro histórias de violência e redenção.',
          releaseDate: '1994-10-14',
          rating: 8.9,
          image: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=Pulp+Fiction',
        },
        {
          id: 3,
          title: 'A Lista de Schindler',
          genre: 'Biografia',
          synopsis: 'A história de Oskar Schindler, um empresário alemão que salvou a vida de mais de mil judeus durante o Holocausto.',
          releaseDate: '1993-12-15',
          rating: 8.9,
          image: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=A+Lista+de+Schindler',
        },
        {
          id: 4,
          title: 'Forrest Gump',
          genre: 'Drama',
          synopsis: 'A vida de Forrest Gump, um homem com QI baixo, mas com um coração de ouro, que viveu momentos históricos dos Estados Unidos.',
          releaseDate: '1994-07-06',
          rating: 8.8,
          image: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=Forrest+Gump',
        },
        {
          id: 5,
          title: 'Matrix',
          genre: 'Ficção Científica',
          synopsis: 'Um programador de computador descobre que a realidade é uma simulação controlada por máquinas inteligentes.',
          releaseDate: '1999-03-31',
          rating: 8.7,
          image: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=Matrix',
        },
        {
          id: 6,
          title: 'O Senhor dos Anéis: A Sociedade do Anel',
          genre: 'Fantasia',
          synopsis: 'Um hobbit e seus companheiros embarcam em uma jornada para destruir um anel mágico e salvar a Terra Média.',
          releaseDate: '2001-12-19',
          rating: 8.8,
          image: 'https://via.placeholder.com/300x450/000000/FFFFFF?text=O+Senhor+dos+Anéis',
        },
      ];

      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: 'SET_MOVIES', payload: mockMovies });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const addToFavorites = (movie) => {
    dispatch({ type: 'ADD_FAVORITE', payload: movie });
  };

  const removeFromFavorites = (movieId) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: movieId });
  };

  const toggleFavorite = (movie) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: movie });
  };

  const isFavorite = (movieId) => {
    return state.favorites.some(movie => movie.id === movieId);
  };

  const value = {
    ...state,
    fetchMovies,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie deve ser usado dentro de um MovieProvider');
  }
  return context;
};

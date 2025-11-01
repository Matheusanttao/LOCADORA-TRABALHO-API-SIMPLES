import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Database
import { initDatabase } from './src/database/database';

// Context
import { MovieProvider } from './src/context/MovieContext';
import { RentalProvider } from './src/context/RentalContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import MovieListScreen from './src/screens/MovieListScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import AboutScreen from './src/screens/AboutScreen';
import ManagementScreen from './src/screens/ManagementScreen';
import AddFilmeScreen from './src/screens/AddFilmeScreen';
import AddClienteScreen from './src/screens/AddClienteScreen';
import FilmesDisponiveisScreen from './src/screens/FilmesDisponiveisScreen';
import LocacaoScreen from './src/screens/LocacaoScreen';
import DevolucaoScreen from './src/screens/DevolucaoScreen';
import HistoricoLocacoesScreen from './src/screens/HistoricoLocacoesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MovieStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MovieList" 
        component={MovieListScreen} 
        options={{ title: 'Filmes' }}
      />
      <Stack.Screen 
        name="MovieDetail" 
        component={MovieDetailScreen} 
        options={{ title: 'Detalhes do Filme' }}
      />
    </Stack.Navigator>
  );
}

function ManagementStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ManagementHome" 
        component={ManagementScreen} 
        options={{ title: 'Gerenciamento' }}
      />
      <Stack.Screen 
        name="AddFilme" 
        component={AddFilmeScreen} 
        options={{ title: 'Adicionar Filme' }}
      />
      <Stack.Screen 
        name="AddCliente" 
        component={AddClienteScreen} 
        options={{ title: 'Registrar Cliente' }}
      />
      <Stack.Screen 
        name="FilmesDisponiveis" 
        component={FilmesDisponiveisScreen} 
        options={{ title: 'Filmes Disponíveis' }}
      />
      <Stack.Screen 
        name="Locacao" 
        component={LocacaoScreen} 
        options={{ title: 'Registrar Locação' }}
      />
      <Stack.Screen 
        name="Devolucao" 
        component={DevolucaoScreen} 
        options={{ title: 'Registrar Devolução' }}
      />
      <Stack.Screen 
        name="HistoricoLocacoes" 
        component={HistoricoLocacoesScreen} 
        options={{ title: 'Histórico de Locações' }}
      />
      <Stack.Screen 
        name="MovieDetail" 
        component={MovieDetailScreen} 
        options={{ title: 'Detalhes do Filme' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Movies') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Management') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Movies" 
        component={MovieStack} 
        options={{ headerShown: false, title: 'Filmes' }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Favoritos' }}
      />
      <Tab.Screen 
        name="Management" 
        component={ManagementStack} 
        options={{ headerShown: false, title: 'Gerenciar' }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ title: 'Sobre' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Inicializa o banco de dados
    const initializeApp = async () => {
      try {
        await initDatabase();
        console.log('Banco de dados inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
      } finally {
        // Simula carregamento da splash screen
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <RentalProvider>
      <MovieProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainTabs />
        </NavigationContainer>
      </MovieProvider>
    </RentalProvider>
  );
}

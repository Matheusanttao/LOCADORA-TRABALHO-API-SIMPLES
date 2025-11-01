# 🎬 CineMax - App de Locadora Digital

Um aplicativo React Native desenvolvido com Expo para gerenciar filmes de uma locadora digital.

## ✨ Funcionalidades

- **Splash Screen** inicial com animação
- **Lista de filmes** com FlatList otimizada
- **Detalhes completos** de cada filme
- **Sistema de favoritos** com Context API
- **Navegação** entre telas (Tab Navigator + Stack Navigator)
- **Interface responsiva** e moderna
- **Banco de Dados SQLite** para persistência de dados
- **Sistema de Locadora** completo:
  - Gestão de filmes (adicionar, listar disponíveis)
  - Gestão de clientes (registrar, listar)
  - Sistema de locações e devoluções com transações
  - Histórico de locações por cliente

## 🚀 Tecnologias Utilizadas

- React Native
- Expo
- Expo SQLite (persistência de dados)
- React Navigation (Tab + Stack)
- Context API
- FlatList
- JavaScript (ES6+)

## 📱 Telas do App

1. **Splash Screen** - Tela inicial com logo da locadora
2. **Lista de Filmes** - Catálogo com FlatList
3. **Detalhes do Filme** - Informações completas
4. **Favoritos** - Lista de filmes favoritos
5. **Sobre** - Informações do aplicativo

## 🛠️ Como Executar

1. Abra o projeto no Expo Snack
2. Execute o aplicativo
3. Navegue pelas diferentes telas usando a barra de navegação inferior

## 📋 Conceitos Demonstrados

- **Navegabilidade**: Tab Navigator + Stack Navigator
- **FlatList**: Lista otimizada de filmes
- **Context API**: Gerenciamento de estado global
- **Splash Screen**: Tela inicial com carregamento
- **Componentes reutilizáveis**
- **Estilização responsiva**
- **SQLite**: Banco de dados local para persistência
- **Transações**: Operações atômicas para locações e devoluções
- **CRUD Completo**: Operações de criação, leitura, atualização

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza SQLite com três tabelas principais:

### Tabela `filmes`
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `titulo`: TEXT NOT NULL
- `genero`: TEXT
- `ano`: INTEGER
- `disponivel`: INTEGER DEFAULT 1 (1 = disponível, 0 = alugado)

### Tabela `clientes`
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `nome`: TEXT NOT NULL
- `email`: TEXT UNIQUE NOT NULL

### Tabela `locacoes`
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `cliente_id`: INTEGER NOT NULL (FOREIGN KEY)
- `filme_id`: INTEGER NOT NULL (FOREIGN KEY)
- `data_locacao`: TEXT NOT NULL
- `data_devolucao`: TEXT (NULL se ainda não foi devolvido)

## 📚 API do Banco de Dados

### Operações com Filmes

```javascript
import { 
  addFilme, 
  getAllFilmes, 
  getFilmesDisponiveis,
  getFilmeById,
  updateFilmeDisponibilidade 
} from './src/database/database';

// Adicionar filme
await addFilme('Matrix', 'Ficção Científica', 1999);

// Listar todos os filmes
const filmes = await getAllFilmes();

// Listar apenas filmes disponíveis
const disponiveis = await getFilmesDisponiveis();

// Buscar filme por ID
const filme = await getFilmeById(1);
```

### Operações com Clientes

```javascript
import { addCliente, getAllClientes, getClienteById } from './src/database/database';

// Registrar cliente
await addCliente('João Silva', 'joao@email.com');

// Listar todos os clientes
const clientes = await getAllClientes();

// Buscar cliente por ID
const cliente = await getClienteById(1);
```

### Operações com Locações

```javascript
import { 
  registrarLocacao, 
  registrarDevolucao, 
  getHistoricoLocacoesCliente,
  getLocacoesAtivas 
} from './src/database/database';

// Registrar locação (usa transação)
await registrarLocacao(clienteId, filmeId);

// Registrar devolução (usa transação)
await registrarDevolucao(locacaoId);

// Histórico de locações de um cliente
const historico = await getHistoricoLocacoesCliente(clienteId);

// Listar locações ativas (não devolvidas)
const ativas = await getLocacoesAtivas();
```

## 🎯 Uso do Contexto de Locadora

O app também fornece um contexto React (`RentalContext`) que facilita o uso das operações:

```javascript
import { useRental } from './src/context/RentalContext';

function MeuComponente() {
  const { 
    fetchFilmes, 
    createFilme, 
    fetchClientes, 
    createCliente,
    createLocacao,
    createDevolucao,
    fetchHistoricoCliente
  } = useRental();

  // Usar as funções...
}
```

## 🎯 Objetivos da Atividade

Este projeto demonstra os conceitos fundamentais de React Native:
- Navegação entre telas
- Gerenciamento de estado
- Listas otimizadas
- Interface de usuário moderna
- Integração com APIs (dados mockados)

---

**Desenvolvido para fins educacionais** 📚

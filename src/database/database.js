import * as SQLite from 'expo-sqlite';

// Inicializa o banco de dados
let db = null;

// Inicializa o banco de dados e cria as tabelas
export const initDatabase = async () => {
  try {
    // Abre o banco de dados usando a API assíncrona
    db = await SQLite.openDatabaseAsync('locadora.db');
    
    // Cria as tabelas usando execAsync
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS filmes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        genero TEXT,
        ano INTEGER,
        disponivel INTEGER DEFAULT 1
      );
      
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS locacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        filme_id INTEGER NOT NULL,
        data_locacao TEXT NOT NULL,
        data_devolucao TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
        FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE RESTRICT
      );`
    );
    
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// ==================== OPERAÇÕES COM FILMES ====================

// Adicionar filme
export const addFilme = async (titulo, genero, ano) => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const result = await db.runAsync(
      'INSERT INTO filmes (titulo, genero, ano) VALUES (?, ?, ?);',
      [titulo, genero, ano]
    );
    
    console.log('Filme adicionado com sucesso');
    return { id: result.lastInsertRowId, titulo, genero, ano, disponivel: 1 };
  } catch (error) {
    console.error('Erro ao adicionar filme:', error);
    throw error;
  }
};

// Listar todos os filmes
export const getAllFilmes = async () => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const filmes = await db.getAllAsync(
      'SELECT * FROM filmes ORDER BY titulo ASC;',
      []
    );
    
    return filmes;
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    throw error;
  }
};

// Listar filmes disponíveis
export const getFilmesDisponiveis = async () => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const filmes = await db.getAllAsync(
      'SELECT * FROM filmes WHERE disponivel = 1 ORDER BY titulo ASC;',
      []
    );
    
    return filmes;
  } catch (error) {
    console.error('Erro ao buscar filmes disponíveis:', error);
    throw error;
  }
};

// Buscar filme por ID
export const getFilmeById = async (id) => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const filme = await db.getFirstAsync(
      'SELECT * FROM filmes WHERE id = ?;',
      [id]
    );
    
    return filme || null;
  } catch (error) {
    console.error('Erro ao buscar filme:', error);
    throw error;
  }
};

// Atualizar status de disponibilidade do filme
export const updateFilmeDisponibilidade = async (filmeId, disponivel) => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const result = await db.runAsync(
      'UPDATE filmes SET disponivel = ? WHERE id = ?;',
      [disponivel ? 1 : 0, filmeId]
    );
    
    return result;
  } catch (error) {
    console.error('Erro ao atualizar disponibilidade do filme:', error);
    throw error;
  }
};

// ==================== OPERAÇÕES COM CLIENTES ====================

// Registrar cliente
export const addCliente = async (nome, email) => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const result = await db.runAsync(
      'INSERT INTO clientes (nome, email) VALUES (?, ?);',
      [nome, email]
    );
    
    console.log('Cliente registrado com sucesso');
    return { id: result.lastInsertRowId, nome, email };
  } catch (error) {
    console.error('Erro ao registrar cliente:', error);
    throw error;
  }
};

// Listar todos os clientes
export const getAllClientes = async () => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const clientes = await db.getAllAsync(
      'SELECT * FROM clientes ORDER BY nome ASC;',
      []
    );
    
    return clientes;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

// Buscar cliente por ID
export const getClienteById = async (id) => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const cliente = await db.getFirstAsync(
      'SELECT * FROM clientes WHERE id = ?;',
      [id]
    );
    
    return cliente || null;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    throw error;
  }
};

// ==================== OPERAÇÕES COM LOCAÇÕES ====================

// Registrar locação (com transação)
export const registrarLocacao = async (clienteId, filmeId) => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const dataLocacao = new Date().toISOString();
    
    // Usa withTransactionAsync para garantir atomicidade
    return await db.withTransactionAsync(async () => {
      // Verifica se o filme está disponível
      const filme = await db.getFirstAsync(
        'SELECT disponivel FROM filmes WHERE id = ?;',
        [filmeId]
      );
      
      if (!filme) {
        throw new Error('Filme não encontrado');
      }
      
      if (filme.disponivel === 0) {
        throw new Error('Filme já está alugado');
      }

      // Insere a locação
      const locacaoResult = await db.runAsync(
        'INSERT INTO locacoes (cliente_id, filme_id, data_locacao) VALUES (?, ?, ?);',
        [clienteId, filmeId, dataLocacao]
      );
      
      // Atualiza o status do filme para indisponível
      await db.runAsync(
        'UPDATE filmes SET disponivel = 0 WHERE id = ?;',
        [filmeId]
      );
      
      console.log('Locação registrada com sucesso');
      return {
        id: locacaoResult.lastInsertRowId,
        cliente_id: clienteId,
        filme_id: filmeId,
        data_locacao: dataLocacao,
        data_devolucao: null,
      };
    });
  } catch (error) {
    console.error('Erro ao registrar locação:', error);
    throw error;
  }
};

// Registrar devolução (com transação)
export const registrarDevolucao = async (locacaoId) => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const dataDevolucao = new Date().toISOString();
    
    // Usa withTransactionAsync para garantir atomicidade
    return await db.withTransactionAsync(async () => {
      // Busca a locação para obter o filme_id
      const locacao = await db.getFirstAsync(
        'SELECT filme_id FROM locacoes WHERE id = ? AND data_devolucao IS NULL;',
        [locacaoId]
      );
      
      if (!locacao) {
        throw new Error('Locação não encontrada ou já foi devolvida');
      }
      
      const filmeId = locacao.filme_id;

      // Atualiza a data de devolução
      await db.runAsync(
        'UPDATE locacoes SET data_devolucao = ? WHERE id = ?;',
        [dataDevolucao, locacaoId]
      );
      
      // Atualiza o status do filme para disponível
      await db.runAsync(
        'UPDATE filmes SET disponivel = 1 WHERE id = ?;',
        [filmeId]
      );
      
      console.log('Devolução registrada com sucesso');
      return {
        id: locacaoId,
        data_devolucao: dataDevolucao,
      };
    });
  } catch (error) {
    console.error('Erro ao registrar devolução:', error);
    throw error;
  }
};

// Listar histórico de locações de um cliente
export const getHistoricoLocacoesCliente = async (clienteId) => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const locacoes = await db.getAllAsync(
      `SELECT 
        l.id,
        l.data_locacao, 
        l.data_devolucao, 
        f.titulo, 
        f.genero,
        f.id as filme_id
      FROM locacoes l
      JOIN filmes f ON l.filme_id = f.id
      WHERE l.cliente_id = ?
      ORDER BY l.data_locacao DESC;`,
      [clienteId]
    );
    
    return locacoes;
  } catch (error) {
    console.error('Erro ao buscar histórico de locações:', error);
    throw error;
  }
};

// Listar todas as locações ativas (não devolvidas)
export const getLocacoesAtivas = async () => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const locacoes = await db.getAllAsync(
      `SELECT 
        l.id,
        l.data_locacao,
        l.cliente_id,
        l.filme_id,
        c.nome as cliente_nome,
        c.email as cliente_email,
        f.titulo as filme_titulo,
        f.genero as filme_genero
      FROM locacoes l
      JOIN clientes c ON l.cliente_id = c.id
      JOIN filmes f ON l.filme_id = f.id
      WHERE l.data_devolucao IS NULL
      ORDER BY l.data_locacao DESC;`,
      []
    );
    
    return locacoes;
  } catch (error) {
    console.error('Erro ao buscar locações ativas:', error);
    throw error;
  }
};

// Listar todas as locações
export const getAllLocacoes = async () => {
  try {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    
    const locacoes = await db.getAllAsync(
      `SELECT 
        l.id,
        l.data_locacao,
        l.data_devolucao,
        l.cliente_id,
        l.filme_id,
        c.nome as cliente_nome,
        c.email as cliente_email,
        f.titulo as filme_titulo,
        f.genero as filme_genero
      FROM locacoes l
      JOIN clientes c ON l.cliente_id = c.id
      JOIN filmes f ON l.filme_id = f.id
      ORDER BY l.data_locacao DESC;`,
      []
    );
    
    return locacoes;
  } catch (error) {
    console.error('Erro ao buscar locações:', error);
    throw error;
  }
};

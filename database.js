import Flamengo from './assets/camisas/flamengo.jpg';
import Vasco from './assets/camisas/vasco.jpg';
import SaoPaulo from './assets/camisas/saopaulo.jpg';
import Corinthians from './assets/camisas/corinthians.jpg';
import Corinthians2 from './assets/camisas/corinthians2.jpg';
import Santos1 from './assets/camisas/santos1.jpg';
import AtleticoMg from './assets/camisas/atleticomg.jpg';
import Internacional from './assets/camisas/internacional.jpg';
import Palmeiras from './assets/camisas/palmeiras.jpg';
import Fluminense from './assets/camisas/fluminense.jpg';
import Cruzeiro from './assets/camisas/cruzeiro.jpg';
import Botafogo from './assets/camisas/botafogo1.jpg';

import * as SQLite from 'expo-sqlite';

// Initialize database
const db = SQLite.openDatabaseSync('amisa.db');

// Initial shirt data (store image filenames in database, use imported images in components)
export const produtosIniciais = [
  {
    id: 1,
    nome: 'Camisa Flamengo 2024',
    preco: 299.9,
    imagem: Flamengo,
    cores: 'Vermelho,Preto',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Flamengo 2024',
  },
  {
    id: 2,
    nome: 'Camisa Vasco 2024',
    preco: 299.9,
    imagem: Vasco,
    cores: 'Preto,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Vasco 2024',
  },
  {
    id: 3,
    nome: 'Camisa São Paulo 2024',
    preco: 289.9,
    imagem: SaoPaulo,
    cores: 'Branco,Vermelho,Preto',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do São Paulo 2024',
  },
  {
    id: 4,
    nome: 'Camisa Corinthians 2024',
    preco: 279.9,
    imagem: Corinthians,
    cores: 'Preto,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Corinthians 2024',
  },
  {
    id: 5,
    nome: 'Camisa Corinthians Yuri Alberto 2024',
    preco: 279.9,
    imagem: Corinthians2,
    cores: 'Preto,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa especial do Corinthians com homenagem ao Yuri Alberto 2024',
  },
  {
    id: 6,
    nome: 'Camisa Santos 2024',
    preco: 269.9,
    imagem: Santos1,
    cores: 'Branco,Preto',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Santos 2024',
  },
  {
    id: 7,
    nome: 'Camisa Atlético Mineiro 2024',
    preco: 289.9,
    imagem: AtleticoMg,
    cores: 'Preto,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Atlético Mineiro 2024',
  },
  {
    id: 8,
    nome: 'Camisa Internacional 2024',
    preco: 289.9,
    imagem: Internacional,
    cores: 'Vermelho,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Internacional 2024',
  },
  {
    id: 9,
    nome: 'Camisa Palmeiras 2024',
    preco: 299.9,
    imagem: Palmeiras,
    cores: 'Verde,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Palmeiras 2024',
  },
  {
    id: 10,
    nome: 'Camisa Fluminense 2024',
    preco: 289.9,
    imagem: Fluminense,
    cores: 'Verde,Grená,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Fluminense 2024',
  },
  {
    id: 11,
    nome: 'Camisa Botafogo 2024',
    preco: 279.9,
    imagem: Botafogo,
    cores: 'Preto,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Botafogo 2024',
  },
  {
    id: 12,
    nome: 'Camisa Cruzeiro 2024',
    preco: 289.9,
    imagem: Cruzeiro,
    cores: 'Azul,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Camisa oficial do Cruzeiro 2024',
  },
];

// Setup database
export const setupDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS camisetas (
        id INTEGER PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        preco REAL NOT NULL,
        imagem TEXT,
        cores TEXT,
        tamanhos TEXT,
        descricao TEXT
      );
    `);

    // Check if table is empty
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM camisetas');
    if (result.count === 0) {
      for (const produto of produtosIniciais) {
        await db.runAsync(
          'INSERT INTO camisetas (id, nome, preco, imagem, cores, tamanhos, descricao) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            produto.id,
            produto.nome,
            produto.preco,
            produto.imagem, 
            produto.cores,
            produto.tamanhos,
            produto.descricao,
          ]
        );
      }
      console.log('Database initialized with initial products.');
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    throw new Error(`Failed to initialize database: ${error.message}`);
  }
};

// Get all products or filter by query
export const getProdutos = async (query = 'SELECT * FROM camisetas') => {
  try {
    const result = await db.getAllAsync(query);
    return result.map((row) => ({
      id: row.id,
      name: row.nome,
      price: row.preco,
      image: row.imagem, // Component must handle string path or URL
      colors: row.cores ? row.cores.split(',') : [],
      sizes: row.tamanhos ? row.tamanhos.split(',') : [],
      description: row.descricao,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Insert product
export const insertProduto = async (produto) => {
  try {
    await db.runAsync(
      'INSERT INTO camisetas (nome, preco, imagem, cores, tamanhos, descricao) VALUES (?, ?, ?, ?, ?, ?)',
      [
        produto.name,
        produto.price,
        produto.image, // Expect string path or URL
        Array.isArray(produto.colors) ? produto.colors.join(',') : produto.colors,
        Array.isArray(produto.sizes) ? produto.sizes.join(',') : produto.sizes,
        produto.description,
      ]
    );
    console.log(`Product ${produto.name} inserted successfully.`);
  } catch (error) {
    console.error('Error inserting product:', error);
    throw new Error(`Failed to insert product: ${error.message}`);
  }
};

// Update product
export const updateProduto = async (produto) => {
  try {
    await db.runAsync(
      'UPDATE camisetas SET nome = ?, preco = ?, imagem = ?, cores = ?, tamanhos = ?, descricao = ? WHERE id = ?',
      [
        produto.name,
        produto.price,
        produto.image, 
        Array.isArray(produto.colors) ? produto.colors.join(',') : produto.colors,
        Array.isArray(produto.sizes) ? produto.sizes.join(',') : produto.sizes,
        produto.description,
        produto.id,
      ]
    );
    console.log(`Product ${produto.name} updated successfully.`);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

// Delete product
export const deleteProduto = async (id) => {
  try {
    await db.runAsync('DELETE FROM camisetas WHERE id = ?', [id]);
    console.log(`Product with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};
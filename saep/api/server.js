import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
const app = express();
const PORT = 3000;

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'saep',
});

// Conectar-se ao banco de dados
connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar-se ao banco de dados:', err);
    } else {
      console.log('Conexão com o banco de dados estabelecida com sucesso!');
    }
  });

// Configuração do CORS
app.use(cors());

app.get('/api/alocacao', (req, res) => {
  const query = 'SELECT area, quantidade FROM alocacao';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao obter dados da tabela de alocação:', err);
      res.status(500).json({ error: 'Erro ao obter dados da tabela de alocação' });
    } else {
      const setores = results.map(row => ({
        area: row.area,
        cor: row.quantidade > 0 ? 'azul' : 'branco',
      }));

      res.json(setores);
    }
  });
});

app.get('/api/automoveis/:alocacao', (req, res) => {
    const alocacao = req.params.alocacao;
    const query = `
      SELECT automoveis.id, automoveis.modelo, automoveis.preco, alocacao.quantidade
      FROM automoveis
      JOIN alocacao ON automoveis.id = alocacao.id
      WHERE alocacao.area = ?
    `;
  
    connection.query(query, [alocacao], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar os veículos.' });
      } else {
        res.json(results);
      }
    });
  });

  app.get('/api/clientes', (req, res) => {
    const query = 'SELECT * FROM clientes';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar os clientes.' });
      } else {
        res.json(results);
      }
    });
  });

  app.get('/api/concessionaria', (req, res) => {
    const query = 'SELECT * FROM concessionaria';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar a concessionaria.' });
      } else {
        res.json(results);
      }
    });
  });

  app.put('/api/vendas/:automovelId', (req, res) => {
    const automovelId = req.params.automovelId;
  
    const updateQuery = `UPDATE alocacao SET quantidade = quantidade - 1 WHERE automovel = ${automovelId}`;
  
    connection.query(updateQuery, (error, results) => {
      if (error) {
        console.error('Erro ao atualizar a quantidade do automóvel:', error);
        res.status(500).json({ error: 'Erro ao atualizar a quantidade do automóvel' });
        return;
      }
  
      res.status(200).json({ message: 'Quantidade do automóvel atualizada com sucesso' });
    });
  });
  
// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
# Sistema de Pátio

Sistema web de gestão de veículos e vendas em pátios desafio proposto pelo SAEP

# Como rodar o sistema

##### :game_die: Banco de Dados

- É nescessario preencher os campos do banco de dados dentro do arquivo server.js na pasta API:

```shell
// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'saep',
});
```

- É necessário ter um programa de gerenciamento de banco de dados, por exemplo o dbeaver para e gerenciar o banco

- Após estabelecer a conexão com o banco de dados, rode os as queries que estão no arquivo 'database.sql' no script do gerenciador de banco de dados para criar as tabelas e inserir os dados:

##### 🔙: Backend

- Após ter feito os passos acima rode os seguintes comandos abaixo no terminal para instalar as dependencias do backend e rodar o servidor:

```shell
cd api
```

```shell
 npm i
```

```shell
node server.js
```

##### 🖥️: Frontend

Para executar o front end basta rodar os comandos abaixo:

```shell
npm i
```

```shell
npm run dev
```

#### ⚙️:Tecnologias

- Vuejs
- Node.js
- Express
- MySQL

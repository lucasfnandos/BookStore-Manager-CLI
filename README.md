# BookStore Manager CLI

### Descrição do Projeto

O BookStore Manager CLI é um sistema de gerenciamento back-end desenvolvido para informatizar e automatizar as operações de uma pequena livraria. Substituindo registros manuais, a aplicação funciona inteiramente via terminal (Command Line Interface - CLI), oferecendo menus interativos para o controle completo do acervo e das movimentações da loja.

O sistema foi concebido com foco na organização em camadas, aplicando boas práticas de programação e separação de responsabilidades para garantir um código limpo, escalável e de fácil manutenção.

### Objetivo

O objetivo central deste projeto é desenvolver uma aplicação CLI robusta em Node.js com TypeScript capaz de gerenciar informações persistentes de forma segura. Os objetivos técnicos específicos incluem:

- Gerenciar o cadastro completo de autores, obras (livros), clientes e os respectivos exemplares físicos.

- Registrar e controlar o fluxo de empréstimos e devoluções.

- Persistir todas as informações em um banco de dados relacional (PostgreSQL).

- Aplicar regras de negócio estritas durante as operações (ex: limite de empréstimos, disponibilidade de exemplares).

- Realizar consultas relacionais avançadas utilizando SQL (JOINs, agregações).

- Gerar relatórios gerenciais a partir dos dados armazenados.

- Utilizar os recursos avançados da linguagem TypeScript, programação orientada a objetos e assincronicidade.

### Funcionalidades

A aplicação é dividida em módulos através de um Menu Principal intuitivo, abrangendo:

- Gestão de Autores: Cadastro, listagem, atualização e exclusão de autores.

- Gestão de Clientes: Controle de usuários da livraria, com validações de dados (CPF, E-mail).

- Gestão de Livros e Exemplares: Separação lógica entre a Obra (Livro) e a Cópia Física (Exemplar), permitindo o cadastro de múltiplas unidades para um mesmo título.

#### Gestão de Empréstimos:

- Realização de empréstimos vinculando um Cliente a um Exemplar específico.

- Controle de disponibilidade de exemplares.

- Validação de regras: Impedir empréstimos de livros já emprestados, limite de 2 livros por cliente, e impedimento de empréstimo de livros repetidos para a mesma pessoa.

- Baixa (devolução) de exemplares.

#### Relatórios Gerenciais:

- Livros Disponíveis (por quantidade).

- Livros Atualmente Emprestados.

- Livros Cadastrados por Autor.

- Histórico Total de Empréstimos por Livro.

- Clientes com Empréstimos Ativos.

#### Tecnologias Utilizadas

- Node.js: Ambiente de execução JavaScript/TypeScript.

- TypeScript: Superset do JavaScript utilizado para tipagem estática e segurança do código.

- PostgreSQL: Sistema de Gerenciamento de Banco de Dados Relacional (SGBD).

- node-postgres (pg): Driver oficial do PostgreSQL para Node.js.

- tsx: Executor moderno de TypeScript para rodar a aplicação em ambiente de desenvolvimento sem necessidade de compilação prévia.

- dotenv: Gerenciamento de variáveis de ambiente.

- readline/promises: Módulo nativo do Node.js para interação CLI.

### Arquitetura do Projeto

O sistema adota uma Arquitetura em Camadas (N-Tier), promovendo a separação estrita de responsabilidades:

- Menu (View): Arquivos responsáveis exclusivamente por interagir com o usuário via terminal (inputs e console.log).

- Controller: Intercepta as requisições do Menu, sanitiza os dados brutos e chama a camada de serviço. É responsável por padronizar as respostas (ControllerResponse) e tratar erros não capturados.

- Service: O "coração" do sistema. Contém todas as regras de negócio (ex: verificar limites de empréstimo). Se comunica exclusivamente com os Repositórios.

- Repository: Única camada com autorização para falar com o Banco de Dados. Contém as queries SQL brutas e retorna os dados mapeados para os Models.

- Models/Interfaces: Definições dos contratos e tipagens (Ex: Entidades do banco).

### Estrutura de Pastas
```
📦 src
 ┣ 📂 controllers
 ┣ 📂 database
 ┣ 📂 menu
 ┣ 📂 models
 ┣ 📂 repositories (Queries SQL)
 ┣ 📂 services
 ┣ 📂 utils
 ┗ 📜 main.ts

```
### Configuração do Banco de Dados

A aplicação requer um banco de dados PostgreSQL rodando localmente ou remotamente.

O script estrutural (DDL) para criação das tabelas encontra-se abaixo e representa o Diagrama de Entidade-Relacionamento do projeto.
```
CREATE DATABASE bookstore_manager_cli;

CREATE TABLE tb_autores(
    id SERIAL,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    CONSTRAINT pk_autor_id PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tb_clientes(
    id SERIAL,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contato VARCHAR(11) NOT NULL,
    data_nascimento DATE NOT NULL,
    CONSTRAINT pk_cliente_id PRIMARY KEY(id)
);

CREATE TABLE tb_livros(
    id SERIAL,
    autor_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    sub_titulo VARCHAR(255) DEFAULT NULL,
    editora VARCHAR(150) NOT NULL,
    publicado_em INTEGER NOT NULL,
    edicao INTEGER NOT NULL,
    formato VARCHAR(100) DEFAULT 'brochura',
    isbn VARCHAR(13) NOT NULL UNIQUE,
    genero VARCHAR(100) NOT NULL DEFAULT 'Não informado',
    CONSTRAINT pk_livro_id PRIMARY KEY(id),
    CONSTRAINT fk_autor_id FOREIGN KEY(autor_id) REFERENCES tb_autores(id) ON DELETE RESTRICT,
    CONSTRAINT chk_edicao CHECK (edicao > 0)
);

CREATE TABLE tb_exemplares(
    id SERIAL,
    livro_id INTEGER NOT NULL,
    cadastrado_em DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Disponivel',
    CONSTRAINT pk_exemplar_id PRIMARY KEY(id),
    CONSTRAINT fk_livro_id FOREIGN KEY(livro_id) REFERENCES tb_livros(id) ON DELETE CASCADE
);

CREATE TABLE tb_emprestimos(
    id SERIAL,
    cliente_id INTEGER,
    exemplar_id INTEGER,
    emprestado_em DATE DEFAULT CURRENT_DATE,
    prazo_devolucao DATE DEFAULT (CURRENT_DATE+15),
    devolvido_em DATE,
    CONSTRAINT pk_emprestimo_id PRIMARY KEY(id),
    CONSTRAINT fk_cliente_id FOREIGN KEY(cliente_id) REFERENCES tb_clientes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_exemplar_id FOREIGN KEY(exemplar_id) REFERENCES tb_exemplares(id) ON DELETE RESTRICT
);
```


### Requisitos para Execução

- Node.js (versão 18.x ou superior recomendada)

- NPM ou Yarn

- PostgreSQL (Rodando na porta padrão 5432 ou conforme configurado)

### Instalação

#### Clone o repositório:
```
git clone https://github.com/seu-usuario/bookstore-manager-cli.git
cd bookstore-manager-cli
```

#### Instale as dependências:
```
npm install
```

#### Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto contendo as credenciais de acesso ao seu banco de dados PostgreSQL recém-criado.
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bookstore_manager_cli
DB_PASSWORD=sua_senha_aqui
DB_PORT=5432
```

### Execução

Para iniciar a aplicação em ambiente de desenvolvimento (utilizando o executor tsx):
```
npm run dev
```

Para compilar e executar a versão de produção:
```
npm run build
npm start
```

### Exemplos de Utilização

Iniciando o Sistema: Ao rodar npm run dev, o Menu Principal será exibido:

    SISTEMA DE BIBLIOTECA CLI       

    1. GESTÃO DE AUTORES
    2. GESTÃO DE CLIENTES
    3. GESTÃO DE LIVROS E OBRAS
    4. GESTÃO DE EXEMPLARES
    5. GESTÃO DE EMPRÉSTIMOS E DEVOLUÇÕES
    6. RELATÓRIOS DO SISTEMA
    0. SAIR DO SISTEMA



#### Cadastrando um Empréstimo (Opção 5): 
- O usuário deve informar o ID do Cliente e o ID do Exemplar físico (previamente cadastrados). O sistema validará automaticamente se o exemplar está livre e se o cliente atende às regras de limite (máximo de 3 livros) e exclusividade de obra.

#### Visualizando Relatórios (Opção 6): 
- Escolhendo "Livros Atualmente Emprestados", o sistema exibirá de forma tabular os títulos que encontram-se fora da biblioteca no momento exato da consulta, utilizando queries SQL em tempo real (JOINs entre as tabelas tb_livros, tb_exemplares e tb_emprestimos).
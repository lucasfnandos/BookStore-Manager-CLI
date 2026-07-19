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
	CONSTRAINT fk_autor_id FOREIGN KEY(autor_id)
	REFERENCES tb_autores(id) ON DELETE RESTRICT,
	CONSTRAINT chk_edicao CHECK (edicao > 0)
);

CREATE TABLE tb_exemplares(
	id SERIAL,
	livro_id INTEGER NOT NULL,
	cadastrado_em DATE DEFAULT CURRENT_DATE,
	status VARCHAR(50) DEFAULT 'Disponivel',
	
	CONSTRAINT pk_exemplar_id PRIMARY KEY(id),
	CONSTRAINT fk_livro_id FOREIGN KEY(livro_id)
	REFERENCES tb_livros(id) ON DELETE CASCADE
);

CREATE TABLE tb_emprestimos(
	id SERIAL,
	cliente_id INTEGER,
	exemplar_id INTEGER,
	emprestado_em DATE DEFAULT CURRENT_DATE,
	prazo_devolucao DATE DEFAULT (CURRENT_DATE+15),
	devolvido_em DATE,

	CONSTRAINT pk_emprestimo_id PRIMARY KEY(id),
	CONSTRAINT fk_cliente_id FOREIGN KEY(cliente_id)
	REFERENCES tb_clientes(id) ON DELETE RESTRICT,
	CONSTRAINT fk_exemplar_id FOREIGN KEY(exemplar_id)
	REFERENCES tb_exemplares(id) ON DELETE RESTRICT
);

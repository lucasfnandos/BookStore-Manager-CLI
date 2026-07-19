import { pool } from '../database/db';
import {
    RelatorioClientesAtivos,
    RelatorioLivrosDisponiveis,
    RelatorioLivrosEmprestados,
    RelatorioLivrosPorAutor,
    RelatorioTotalEmprestimos
} from "../models/Relatorios"

export async function repositoryRelatorioLivrosDisponiveis(): Promise<RelatorioLivrosDisponiveis[]> {
    const sql = `
        SELECT 
            l.titulo,
            l.sub_titulo, 
            l.edicao,
            l.publicado_em AS ano,
            a.nome AS autor,
            COUNT(e.id) as qtd 
        FROM tb_livros l 
        JOIN tb_exemplares e ON l.id = e.livro_id
        JOIN tb_autores a ON a.id = l.autor_id
        WHERE e.status = 'Disponivel'
        GROUP BY l.titulo, l.sub_titulo, l.edicao, l.publicado_em, a.nome
    `;
    const res = await pool.query<RelatorioLivrosDisponiveis>(sql)
    return res.rows
}

export async function repositoryRelatorioLivrosEmprestados(): Promise<RelatorioLivrosEmprestados[]> {
    const sql = `
        SELECT 
            l.titulo, 
            COUNT(emp.id) as qtd
        FROM tb_livros l 
        JOIN tb_exemplares e ON l.id = e.livro_id
        JOIN tb_emprestimos emp ON e.id = emp.exemplar_id
        WHERE emp.devolvido_em IS NULL 
        GROUP BY l.titulo
    `;
    const res = await pool.query<RelatorioLivrosEmprestados>(sql)
    return res.rows
}

export async function repositoryRelatorioLivrosPorAutor(): Promise<RelatorioLivrosPorAutor[]> {
    const sql = `
        SELECT 
            a.nome,
            a.nacionalidade, 
            COUNT(l.id) as qtd 
        FROM tb_autores a 
        LEFT JOIN tb_livros l ON a.id = l.autor_id 
        GROUP BY a.nome, a.nacionalidade
    `;
    const res = await pool.query<RelatorioLivrosPorAutor>(sql)
    return res.rows
}

export async function repositoryRelatorioTotalEmprestimosPorLivro(): Promise<RelatorioTotalEmprestimos[]> {
    const sql = `
        SELECT 
            l.titulo,
            a.nome AS autor, 
            COUNT(emp.id) as total_emprestimos 
        FROM tb_livros l 
        JOIN tb_autores a ON l.autor_id = a.id 
        LEFT JOIN tb_exemplares e ON l.id = e.livro_id
        LEFT JOIN tb_emprestimos emp ON e.id = emp.exemplar_id 
        GROUP BY l.titulo, a.nome
    `;
    const res = await pool.query<RelatorioTotalEmprestimos>(sql)
    return res.rows
}

export async function repositoryRelatorioClientesComEmprestimosAtivos(): Promise<RelatorioClientesAtivos[]> {
    const sql = `
        SELECT 
            c.nome, 
            c.email,
            COUNT(emp.id) as qtd_emprestimos_ativos
        FROM tb_clientes c
        JOIN tb_emprestimos emp ON c.id = emp.cliente_id
        WHERE emp.devolvido_em IS NULL
        GROUP BY c.id, c.nome, c.email
    `;
    const res = await pool.query<RelatorioClientesAtivos>(sql)
    return res.rows
}
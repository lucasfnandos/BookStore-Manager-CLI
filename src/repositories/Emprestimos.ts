import { pool } from '../database/db'
import { EmprestimoDetalhado } from '../models/Emprestimos'

export async function repositoryCriarEmprestimo(cliente_id: number, exemplar_id: number): Promise<number | null> {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const sqlEmprestimo = `INSERT INTO tb_emprestimos (cliente_id, exemplar_id) VALUES ($1, $2) RETURNING id`
        const res = await client.query<{ id: number }>(sqlEmprestimo, [cliente_id, exemplar_id]);
        
        if (!res.rows[0]) {
            throw new Error("DB_RETORNO_NULO")
        }
        const idEmprestimo = res.rows[0].id

        const sqlStatus = `UPDATE tb_exemplares SET status = 'Emprestado' WHERE id = $1`
        await client.query(sqlStatus, [exemplar_id])

        await client.query('COMMIT')
        return idEmprestimo;
    } catch (err) {
        await client.query('ROLLBACK')
        throw err;
    } finally {
        client.release()
    }
}

export async function repositoryRegistrarDevolucao(id: number, exemplar_id: number): Promise<boolean> {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        
        const sqlDevolucao = `UPDATE tb_emprestimos SET devolvido_em = CURRENT_DATE WHERE id = $1`
        const resDevolucao = await client.query(sqlDevolucao, [id])
        
        if ((resDevolucao.rowCount ?? 0) === 0) {
            throw new Error("FALHA_AO_ATUALIZAR")
        }

        const sqlStatus = `UPDATE tb_exemplares SET status = 'Disponivel' WHERE id = $1`
        const resStatus = await client.query(sqlStatus, [exemplar_id])

        if ((resStatus.rowCount ?? 0) === 0) {
            throw new Error("FALHA_AO_ATUALIZAR")
        }

        await client.query('COMMIT')
        return true
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
}

export async function repositoryBuscarEmprestimoAtivoPorCliente(cliente_id: number): Promise<EmprestimoDetalhado[]> {
    const sql = `
        SELECT 
            emp.id, 
            emp.exemplar_id,
            l.id AS livro_id,
            c.nome AS cliente_nome, 
            a.nome AS autor_nome, 
            l.titulo, 
            l.edicao, 
            l.isbn
        FROM tb_emprestimos emp
        JOIN tb_exemplares e ON e.id = emp.exemplar_id
        JOIN tb_livros l ON l.id = e.livro_id
        JOIN tb_clientes c ON c.id = emp.cliente_id
        JOIN tb_autores a ON a.id = l.autor_id
        WHERE emp.cliente_id = $1 
        AND emp.devolvido_em IS NULL`

    const res = await pool.query<EmprestimoDetalhado>(sql, [cliente_id])
    return res.rows
}

export async function repositoryContarEmprestimosAtivos(cliente_id: number): Promise<number> {
    const sql = `SELECT COUNT(*) FROM tb_emprestimos WHERE cliente_id = $1 AND devolvido_em IS NULL`
    const res = await pool.query<{ count: string }>(sql, [cliente_id])
    
    if (!res.rows[0]) {
        throw new Error("DB_RETORNO_NULO")
    }
    
    return parseInt(res.rows[0].count)
}

export async function repositoryBuscarLivrosPorAutorComDisponibilidade(autor_id: number): Promise<any[]> {
    const sql = `
        SELECT 
            l.id, l.titulo, l.sub_titulo, l.edicao, l.formato, l.publicado_em,
            COUNT(e.id) FILTER (WHERE e.status = 'Disponivel') AS qtd_disponivel
        FROM tb_livros l
        LEFT JOIN tb_exemplares e ON l.id = e.livro_id
        WHERE l.autor_id = $1
        GROUP BY l.id`
    try {
        const result = await pool.query(sql, [autor_id])
        return result.rows;
    } catch (err) {
        throw err
    }
}

export async function repositoryBuscarLivrosPorTituloComDisponibilidade(titulo: string): Promise<any[]> {
    const sql = `
        SELECT 
            l.id, l.titulo, l.sub_titulo, l.edicao, l.formato, l.publicado_em,
            COUNT(e.id) FILTER (WHERE e.status = 'Disponivel') AS qtd_disponivel
        FROM tb_livros l
        LEFT JOIN tb_exemplares e ON l.id = e.livro_id
        WHERE l.titulo ILIKE $1
        GROUP BY l.id`
    try {
        const result = await pool.query(sql, [`%${titulo}%`]);
        return result.rows
    } catch (err) {
        throw err
    }
}
import { pool } from '../database/db'
import { Exemplares } from "../models/Exemplares"

export async function repositoryCriarExemplar(livro_id: number): Promise<number | null> {
    const sql = `INSERT INTO tb_exemplares (livro_id) VALUES ($1) RETURNING id`
    try {
        const result = await pool.query<{ id: number }>(sql, [livro_id])
        return result.rows[0]?.id ?? null
    } catch (err) {
        throw err
    }
}

export async function repositoryBuscarExemplarPorId(id: number): Promise<Exemplares | null> {
    const sql = `SELECT * FROM tb_exemplares WHERE id=$1`
    try {
        const result = await pool.query<Exemplares>(sql, [id])
        return result.rows[0] ?? null
    } catch (err) {
        throw err
    }
}

export async function repositoryBuscarExemplaresPorLivroId(livro_id: number): Promise<Exemplares[]> {
    const sql = `SELECT * FROM tb_exemplares WHERE livro_id=$1`
    try {
        const result = await pool.query<Exemplares>(sql, [livro_id])
        return result.rows
    } catch (err) {
        throw err
    }
}

export async function repositoryAtualizarStatusExemplar(id: number, status: string): Promise<boolean> {
    const sql = `UPDATE tb_exemplares SET status=$1 WHERE id=$2`
    try {
        const result = await pool.query(sql, [status, id])
        return (result.rowCount ?? 0) > 0
    } catch (err) {
        throw err
    }
}

export async function repositoryDeletarExemplar(id: number): Promise<boolean> {
    const sql = `DELETE FROM tb_exemplares WHERE id = $1`
    try {
        const result = await pool.query(sql, [id])
        return (result.rowCount ?? 0) > 0
    } catch (err) {
        throw err
    }
}

export async function repositoryListarTodosExemplares(): Promise<Exemplares[]> {
    const sql = `SELECT * FROM tb_exemplares`
    try {
        const result = await pool.query<Exemplares>(sql)
        return result.rows
    } catch (err) {
        throw err
    }
}
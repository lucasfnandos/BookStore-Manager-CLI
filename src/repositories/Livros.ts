import { pool } from '../database/db'
import { Livros } from "../models/Livros"

export async function repositoryCriarLivro(autor_id:number, titulo:string, sub_titulo:string, editora:string, publicado_em:Date, edicao:number, formato:string, isbn:string, genero:string): Promise<number | null>{
    const sql = `INSERT INTO tb_livros (autor_id, titulo, sub_titulo, editora, publicado_em, edicao, formato, isbn, genero) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`
    try {
        const result = await pool.query(sql, [autor_id, titulo, sub_titulo, editora, publicado_em, edicao, formato, isbn, genero])
        if(typeof result.rows[0] === 'undefined') return null
        const id = result.rows[0].id
        return id

    } catch(err) {
        throw err
    }
}

export async function repositoryBuscarLivroPorId(id:number):Promise<Livros | null> {
    const sql = `SELECT * FROM tb_livros WHERE id=$1`
    try {
        const result = await pool.query<Livros>(sql, [id])
        return result.rows[0] ?? null

    } catch(err) {
        throw err

    }
}

export async function repositoryBuscarLivroPorAutorId(autor_id:number):Promise<Livros[]> {
    const sql = `SELECT * FROM tb_livros WHERE autor_id=$1`
    try {
        const result = await pool.query<Livros>(sql, [autor_id])
        return result.rows
    } catch(err) {
        throw err
    }
}

export async function repositoryAtualizarLivro(id:number, autor_id:number, titulo:string, sub_titulo:string, editora:string, publicado_em:Date, edicao:number, formato:string, isbn:string, genero:string): Promise<number | null> {
    const sql = `UPDATE tb_livros SET autor_id=$1, titulo=$2, sub_titulo=$3, editora=$4, publicado_em=$5, edicao=$6, formato=$7, isbn=$8, genero=$9 WHERE id=$10 RETURNING id`
    try {
        const result = await pool.query<Livros>(sql, [autor_id, titulo, sub_titulo, editora, publicado_em, edicao, formato, isbn, genero, id])
        if(typeof result.rows[0] === 'undefined') return null
        return result.rows[0].id
    } catch(err) {
        throw err
    }
}

export async function repositoryDeletarLivro(id:number): Promise<boolean>{
    const sql = `DELETE FROM tb_livros WHERE id = $1`;
    try {
        const result = await pool.query<Livros>(sql, [id])
        return (result.rowCount ?? 0) > 0
    } catch(err) {
        throw err
    }
    
}

export async function repositoryExisteLivro(isbn:string):Promise<boolean> {
    const sql = `SELECT id FROM tb_livros WHERE isbn=$1 LIMIT 1`
    try {
        const result = await pool.query<Livros>(sql, [isbn])
        return (result.rowCount ?? 0) > 0
    } catch(err) {
        throw err
    }
}


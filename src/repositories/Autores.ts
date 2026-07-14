import { pool } from '../database/db'
import { Autores  } from '../models/Autores'

export async function criarAutor(nome:string, nacionalidade:string, data_nascimento:Date): Promise<number | null>{
    const sql = `INSERT INTO tb_autores (nome, nacionalidade, data_nascimento) VALUES ($1,$2,$3) RETURNING id`
    try {
        const result = await pool.query<Autores>(sql, [nome, nacionalidade, data_nascimento])
        if(typeof result.rows[0] === 'undefined') return null
        const id = result.rows[0].id
        return id

    } catch(err) {
        throw err
    }
}

export async function buscarAutorPorId(id:number):Promise<Autores | null> {
    const sql = `SELECT * FROM tb_autores WHERE id=$1`
    try {
        const result = await pool.query<Autores>(sql, [id])
        return result.rows[0] ?? null

    } catch(err) {
        throw err

    }
}

export async function buscarAutorPorNome(nome:string):Promise<Autores[] | []> {
    const sql = `SELECT id FROM tb_autores WHERE ILIKE '%$1%'`
    try {
        const result = await pool.query(sql, [nome])
        return result.rows[0] ?? []
    } catch(err) {
        throw err
    }
}

export async function atualizarAutor(id:number, nome:string, nacionalidade:string, data_nascimento:Date): Promise<number | null> {
    const sql = `UPDATE tb_autores SET nome=$1, nacionalidade=$2, data_nascimento=$3 WHERE id=$4 RETURNING id`
    try {
        const result = await pool.query<Autores>(sql, [nome, nacionalidade, data_nascimento, id])
        if(typeof result.rows[0] === 'undefined') return null
        return result.rows[0].id
    } catch(err) {
        throw err
    }
}

export async function deletarAutor(id:number): Promise<boolean>{
    const sql = `DELETE FROM tb_autores WHERE id = $1`;
    try {
        const result = await pool.query<Autores>(sql, [id])
        return (result.rowCount ?? 0) > 0
    } catch(err) {
        throw err
    }
    
}

export async function existeAutor(nome:string, nacionalidade:string, data_nascimento:Date):Promise<boolean> {
    const sql = `SELECT * FROM tb_autores WHERE nome=$1, nacionalidade=$2, data_nascimento=$3`
    try {
        const result = await pool.query<Autores>(sql, [nome, nacionalidade, data_nascimento])
        return (result.rowCount ?? 0) > 0
    } catch(err) {
        throw err
    }
}
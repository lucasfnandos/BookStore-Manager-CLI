import { pool } from '../database/db'
import { Clientes  } from '../models/Clientes'

export async function repositoryCriarCliente(nome:string, cpf:string, email:string, contato:string, data_nascimento:Date): Promise<number | null>{
    const sql = `INSERT INTO tb_clientes (nome, cpf, email, contato, data_nascimento) VALUES ($1,$2,$3,$4,$5) RETURNING id`
    try {
        const result = await pool.query(sql, [nome, cpf, email, contato, data_nascimento])
        if(typeof result.rows[0] === 'undefined') return null
        const id = result.rows[0].id
        return id

    } catch(err) {
        throw err
    }
}

export async function repositoryBuscarClientePorId(id:number):Promise<Clientes | null> {
    const sql = `SELECT * FROM tb_clientes WHERE id=$1`
    try {
        const result = await pool.query<Clientes>(sql, [id])
        return result.rows[0] ?? null

    } catch(err) {
        throw err

    }
}

export async function repositoryBuscarClientePorNome(nome:string):Promise<Clientes[]> {
    const sql = `SELECT * FROM tb_clientes WHERE nome ILIKE $1`
    try {
        const result = await pool.query<Clientes>(sql, [`${nome}%`])
        return result.rows
    } catch(err) {
        throw err
    }
}

export async function repositoryAtualizarCliente(id:number, nome:string, cpf:string, email:string, contato:string, data_nascimento:Date): Promise<number | null> {
    const sql = `UPDATE tb_clientes SET nome=$1, cpf=$2, email=$3, contato=$4, data_nascimento=$5 WHERE id=$6 RETURNING id`
    try {
        const result = await pool.query<Clientes>(sql, [nome, cpf, email, contato, data_nascimento, id])
        if(typeof result.rows[0] === 'undefined') return null
        return result.rows[0].id
    } catch(err) {
        throw err
    }
}

export async function repositoryDeletarCliente(id:number): Promise<boolean>{
    const sql = `DELETE FROM tb_clientes WHERE id = $1`;
    try {
        const result = await pool.query<Clientes>(sql, [id])
        return (result.rowCount ?? 0) > 0
    } catch(err) {
        throw err
    }
    
}

export async function repositoryExisteCliente(cpf:string, email:string):Promise<boolean> {
    const sql = `SELECT id FROM tb_clientes WHERE cpf=$1 OR email=$2 LIMIT 1`
    try {
        const result = await pool.query<Clientes>(sql, [cpf, email])
        return (result.rowCount ?? 0) > 0
    } catch(err) {
        throw err
    }
}
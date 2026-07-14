import { pool } from "../database/db";
import { Autores } from "../models/Autores";
import { criarAutor, 
        buscarAutorPorId,
        buscarAutorPorNome,
        atualizarAutor,
        deletarAutor,
        existeAutor
} from "../repositories/Autores";

export async function cadastrarAutor(nome:string, nacionalidade:string, data_nascimento:Date): Promise<Autores | null> {
    //VALIDAR SE O AUTOR JÁ EXISTE
    const existe_autor = await existeAutor(nome, nacionalidade, data_nascimento)
    if(!existe_autor) return null
    try {
        const id = criarAutor(nome, nacionalidade, data_nascimento) //AQUI PODE EXPLODIR AQUELE ERRO DO BLOCO TRY/CATCH
        if(typeof id === null) return null //RETORNAR ALGUMA MENSAGEM AQUI?
        const sql2 = `SELECT * FROM tb_autores WHERE id=$1`
        try {
            const result2 = await pool.query<Autores>(sql2, [id])
            return result2.rows[0] ?? null //CASO AQUI RETORNE NULL VERIFICAR COMO DIFERENCIAR DO ANTERIOR
        } catch(err) {
            throw err
        }
        
    } catch(err) {
        throw err //JOGO ESSE ERRO PRA FRENTE? OU TRATO AQUI
    }
}
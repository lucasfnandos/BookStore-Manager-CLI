import { pool } from "../database/db";
import { Autores } from "../models/Autores";
import { criarAutor, 
        buscarAutorPorId,
        buscarAutorPorNome,
        atualizarAutor,
        deletarAutor,
        existeAutor
} from "../repositories/Autores";

export async function cadastrarAutor(nome:string, nacionalidade:string, data_nascimento:Date): Promise<Autores | string> {
    const existe_autor = await existeAutor(nome, nacionalidade, data_nascimento)
    if(existe_autor) return "Uma função que diz que esse autor já está cadastrado"
    try {
        const id = await criarAutor(nome, nacionalidade, data_nascimento) //AQUI PODE EXPLODIR AQUELE ERRO DO BLOCO TRY/CATCH
        if(!id) {
            return "Uma função que diz que não foi possível cadastrar o autor"
        } else {
            const autor_cadastrado =  {id: id, nome: nome, nacionalidade: nacionalidade, data_nascimento: data_nascimento}
            return autor_cadastrado
        }
    } catch(err) {
        return "AQUI TEREMOS A FUNÇAO DE TRADUZIR O ERRO E RETORNA-LO NA TELA COM TIPO STRING"
    }
}

export async function editarAutor(id:number, nome?:string, nacionalidade?:string, data_nascimento?:Date): Promise<Autores | string> {
    const existe_autor_id = await buscarAutorPorId(id)
    if(!existe_autor_id) return "ERRO: O ID NÃO CORRESPONDE A UM AUTOR"
    try {
        const nomeFinal = nome || existe_autor_id.nome
        const nacionalFinal = nacionalidade || existe_autor_id.nacionalidade
        const data_nascFinal = data_nascimento || existe_autor_id.data_nascimento
        const editar_autor = await atualizarAutor(id, nomeFinal, nacionalFinal, data_nascFinal)
        if(!editar_autor) return "ERRO: O BANCO DE DADOS FALHOU EM RETORNAR OS DADOS DO AUTOR"
        const autor_editado = {id: id, nome:nomeFinal, nacionalidade:nacionalFinal, data_nascimento:data_nascFinal}
        return autor_editado
    } catch(err) {
        return "ERRO: HOUVE UM ERRO DURANTE A EXECUÇÃO DA EDIÇÃO"
    }
}

export async function encontrarAutor(nome:string): Promise<Autores[] | []> {
    
}
import { Autores } from "../models/Autores";
import { 
    criarAutor, 
    buscarAutorPorId,
    buscarAutorPorNome,
    atualizarAutor,
    deletarAutor,
    existeAutor
} from "../repositories/Autores";

export async function cadastrarAutor(nome: string, nacionalidade: string, data_nascimento: Date): Promise<Autores> {
    const autorExiste = await existeAutor(nome, nacionalidade, data_nascimento);
    if (autorExiste) {
        throw new Error("ENTIDADE_JA_EXISTE");
    }
    
    const id = await criarAutor(nome, nacionalidade, data_nascimento); 
    if (!id) {
        throw new Error("DB_RETORNO_NULO");
    } 
    
    return { id, nome, nacionalidade, data_nascimento };
}

export async function editarAutor(id: number, nome?: string, nacionalidade?: string, data_nascimento?: Date): Promise<Autores> {
    const autorExistente = await buscarAutorPorId(id);
    if (!autorExistente) {
        throw new Error("ID_NAO_ENCONTRADO");
    }
    
    const nomeFinal = nome || autorExistente.nome;
    const nacionalidadeFinal = nacionalidade || autorExistente.nacionalidade;
    const dataNascimentoFinal = data_nascimento || autorExistente.data_nascimento;
    
    const atualizado = await atualizarAutor(id, nomeFinal, nacionalidadeFinal, dataNascimentoFinal);
    if (!atualizado) {
        throw new Error("DB_RETORNO_NULO");
    }
    
    return { id, nome: nomeFinal, nacionalidade: nacionalidadeFinal, data_nascimento: dataNascimentoFinal };
}

export async function encontrarAutor(nome: string): Promise<Autores[]> {
    const autores = await buscarAutorPorNome(nome);
    return autores;
}

export async function removerAutor(id: number): Promise<boolean> {
    const autorExistente = await buscarAutorPorId(id);
    if (!autorExistente) {
        throw new Error("ID_NAO_ENCONTRADO");
    }
    
    const deletado = await deletarAutor(id);
    if (!deletado) {
        throw new Error("FALHA_AO_DELETAR");
    }
    
    return true;
}
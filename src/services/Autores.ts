import { Autores } from "../models/Autores";
import { 
    repositoryCriarAutor, 
    repositoryBuscarAutorPorId,
    repositoryBuscarAutorPorNome,
    repositoryAtualizarAutor,
    repositoryDeletarAutor,
    repositoryExisteAutor
} from "../repositories/Autores";

export async function serviceCriarAutor(nome: string, nacionalidade: string, data_nascimento: Date): Promise<Autores> {
    const autorExiste = await repositoryExisteAutor(nome, nacionalidade, data_nascimento);
    if (autorExiste) {
        throw new Error("ENTIDADE_JA_EXISTE");
    }
    
    const id = await repositoryCriarAutor(nome, nacionalidade, data_nascimento); 
    if (!id) {
        throw new Error("DB_RETORNO_NULO");
    } 
    
    return { id, nome, nacionalidade, data_nascimento };
}

export async function serviceAtualizarAutor(id: number, nome?: string, nacionalidade?: string, data_nascimento?: Date): Promise<Autores> {
    const autorExistente = await repositoryBuscarAutorPorId(id);
    if (!autorExistente) {
        throw new Error("ID_NAO_ENCONTRADO");
    }
    
    const nomeFinal = nome || autorExistente.nome;
    const nacionalidadeFinal = nacionalidade || autorExistente.nacionalidade;
    const dataNascimentoFinal = data_nascimento || autorExistente.data_nascimento;
    
    const atualizado = await repositoryAtualizarAutor(id, nomeFinal, nacionalidadeFinal, dataNascimentoFinal);
    if (!atualizado) {
        throw new Error("DB_RETORNO_NULO");
    }
    
    return { id, nome: nomeFinal, nacionalidade: nacionalidadeFinal, data_nascimento: dataNascimentoFinal };
}

export async function serviceBuscarAutorPorNome(nome: string): Promise<Autores[]> {
    const autores = await repositoryBuscarAutorPorNome(nome);
    return autores;
}

export async function serviceDeletarAutor(id: number): Promise<boolean> {
    const autorExistente = await repositoryBuscarAutorPorId(id);
    if (!autorExistente) {
        throw new Error("ID_NAO_ENCONTRADO");
    }
    
    const deletado = await repositoryDeletarAutor(id);
    if (!deletado) {
        throw new Error("FALHA_AO_DELETAR");
    }
    
    return true;
}
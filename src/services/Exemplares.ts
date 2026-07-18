import { Exemplares, StatusExemplar } from "../models/Exemplares"
import { 
    repositoryCriarExemplar,
    repositoryBuscarExemplarPorId,
    repositoryBuscarExemplaresPorLivroId,
    repositoryAtualizarStatusExemplar,
    repositoryDeletarExemplar
} from "../repositories/Exemplares"

export async function serviceCriarExemplar(livro_id: number): Promise<Exemplares> {
    const id = await repositoryCriarExemplar(livro_id)
    
    if (!id) {
        throw new Error("DB_RETORNO_NULO")
    }

    return { id, livro_id, cadastrado_em: new Date(), status: 'Disponivel' };
}

export async function serviceAtualizarStatusExemplar(id: number, status: StatusExemplar): Promise<boolean> {
    const exemplar = await repositoryBuscarExemplarPorId(id);
    if (!exemplar) {
        throw new Error("ID_NAO_ENCONTRADO")
    }

    const atualizado = await repositoryAtualizarStatusExemplar(id, status)
    if (!atualizado) {
        throw new Error("FALHA_AO_ATUALIZAR")
    }

    return true
}

export async function serviceValidarDisponibilidadeParaEmprestimo(id: number): Promise<void> {
    const exemplar = await repositoryBuscarExemplarPorId(id)
    if (!exemplar) {
        throw new Error("ID_NAO_ENCONTRADO")
    }
    if (exemplar.status !== 'Disponivel') {
        throw new Error("EXEMPLAR_INDISPONIVEL")
    }
}

export async function serviceBuscarExemplaresPorLivroId(livro_id: number): Promise<Exemplares[]> {
    return await repositoryBuscarExemplaresPorLivroId(livro_id)
}

export async function serviceDeletarExemplar(id: number): Promise<boolean> {
    const exemplar = await repositoryBuscarExemplarPorId(id)
    if (!exemplar) {
        throw new Error("ID_NAO_ENCONTRADO")
    }

    if (exemplar.status === 'Emprestado') {
        throw new Error("EXEMPLAR_EM_USO")
    }

    const deletado = await repositoryDeletarExemplar(id)
    if (!deletado) {
        throw new Error("FALHA_AO_DELETAR")
    }

    return true
}
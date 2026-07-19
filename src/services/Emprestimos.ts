import { 
    repositoryCriarEmprestimo, 
    repositoryRegistrarDevolucao, 
    repositoryContarEmprestimosAtivos,
    repositoryBuscarEmprestimoAtivoPorCliente,
    repositoryBuscarLivrosPorAutorComDisponibilidade,
    repositoryBuscarLivrosPorTituloComDisponibilidade
} from "../repositories/Emprestimos";
import { serviceValidarDisponibilidadeParaEmprestimo } from "./Exemplares";
import { repositoryBuscarExemplarPorId } from "../repositories/Exemplares";

export async function serviceCadastrarEmprestimo(cliente_id: number, exemplar_id: number): Promise<number | null> {
 
    await serviceValidarDisponibilidadeParaEmprestimo(exemplar_id)

    const exemplar = await repositoryBuscarExemplarPorId(exemplar_id)
    if (!exemplar) throw new Error("ID_NAO_ENCONTRADO")

    const totalAtivos = await repositoryContarEmprestimosAtivos(cliente_id)
    if (totalAtivos > 2) {
        throw new Error("CLIENTE_COM_LIMITE_ATINGIDO")
    }

    const emprestimosAtivos = await repositoryBuscarEmprestimoAtivoPorCliente(cliente_id)
    for (const emp of emprestimosAtivos) {
        const empExemplar = await repositoryBuscarExemplarPorId(emp.exemplar_id)
        if (empExemplar && empExemplar.livro_id === exemplar.livro_id) {
            throw new Error("CLIENTE_JA_POSSUI_LIVRO")
        }
    }

    return await repositoryCriarEmprestimo(cliente_id, exemplar_id);
}

export async function serviceRegistrarDevolucao(emprestimo_id: number, exemplar_id: number): Promise<boolean> {
    return await repositoryRegistrarDevolucao(emprestimo_id, exemplar_id);
}

export async function serviceBuscarEmprestimosAtivosPorCliente(cliente_id: number) {
    return await repositoryBuscarEmprestimoAtivoPorCliente(cliente_id);
}

export async function serviceBuscarLivrosPorAutorComDisponibilidade(autor_id: number): Promise<any[]> {
    return await repositoryBuscarLivrosPorAutorComDisponibilidade(autor_id);
}

export async function serviceBuscarLivrosPorTituloComDisponibilidade(titulo: string): Promise<any[]> {
    if (!titulo || titulo.trim() === "") {
        throw new Error("TITULO_INVALIDO");
    }
    return await repositoryBuscarLivrosPorTituloComDisponibilidade(titulo);
}

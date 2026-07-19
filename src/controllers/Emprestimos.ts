import { ControllerResponse } from "../models/Types"
import { 
    serviceCadastrarEmprestimo, 
    serviceRegistrarDevolucao,
    serviceBuscarEmprestimosAtivosPorCliente,
    serviceBuscarLivrosPorAutorComDisponibilidade,
    serviceBuscarLivrosPorTituloComDisponibilidade
} from "../services/Emprestimos"
import { limparId, limparTexto } from "../utils/sanitizers"
import { traduzirErro } from "../utils/errorMessages"

export async function controllerCadastrarEmprestimo(cliente_id: string, exemplar_id: string): Promise<ControllerResponse> {
    try {
        const cId = limparId(cliente_id)
        const eId = limparId(exemplar_id)
        if (isNaN(cId) || isNaN(eId)) {
            return { sucesso: false, mensagem: "Erro: IDs de cliente ou exemplar inválidos." }
        }
        const idEmprestimo = await serviceCadastrarEmprestimo(cId, eId);
        return { 
            sucesso: true, 
            mensagem: "Empréstimo registrado com sucesso!", 
            dados: { id: idEmprestimo } 
        }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Empréstimo') }
    }
}

export async function controllerRegistrarDevolucao(emprestimo_id: string, exemplar_id: string): Promise<ControllerResponse> {
    try {
        const empId = limparId(emprestimo_id)
        const exId = limparId(exemplar_id)
        if (isNaN(empId) || isNaN(exId)) {
            return { sucesso: false, mensagem: "Erro: IDs inválidos para a devolução." }
        }
        await serviceRegistrarDevolucao(empId, exId);
        return { sucesso: true, mensagem: "Devolução realizada com sucesso!" }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Empréstimo') }
    }
}

export async function controllerListarEmprestimosPorCliente(cliente_id: string): Promise<ControllerResponse> {
    try {
        const cId = limparId(cliente_id)
        if (isNaN(cId)) return { sucesso: false, mensagem: "Erro: ID do cliente inválido." }

        const dados = await serviceBuscarEmprestimosAtivosPorCliente(cId)
        return { sucesso: true, mensagem: "Consulta realizada com sucesso.", dados }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Empréstimo') }
    }
}
export async function controllerBuscarLivrosPorAutorComDisponibilidade(autor_id: string): Promise<ControllerResponse> {
    try {
        const idAutor = limparId(autor_id)
        if (isNaN(idAutor)) {
            return { sucesso: false, mensagem: "Erro: o ID do Autor informado é inválido." }
        }
        const dados = await serviceBuscarLivrosPorAutorComDisponibilidade(idAutor)
        return { sucesso: true, mensagem: "Consulta realizada com sucesso.", dados }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Livro') }
    }
}

export async function controllerBuscarLivrosPorTituloComDisponibilidade(titulo: string): Promise<ControllerResponse> {
    try {
        const tituloLimpo = limparTexto(titulo)
        if (!tituloLimpo) {
            return { sucesso: false, mensagem: "Erro: o título informado é inválido ou está vazio." }
        }
        const dados = await serviceBuscarLivrosPorTituloComDisponibilidade(tituloLimpo)
        return { sucesso: true, mensagem: "Consulta realizada com sucesso.", dados }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Livro') }
    }
}
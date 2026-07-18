import { ControllerResponse } from "../models/Types"
import { 
    serviceCriarExemplar, 
    serviceAtualizarStatusExemplar, 
    serviceDeletarExemplar,
    serviceValidarDisponibilidadeParaEmprestimo
} from "../services/Exemplares"
import { limparId } from "../utils/sanitizers"
import { traduzirErro } from "../utils/errorMessages"
import { StatusExemplar } from "../models/Exemplares"

export async function controllerCriarExemplar(livro_id: string): Promise<ControllerResponse> {
    try {
        const idLivro = limparId(livro_id)
        if (isNaN(idLivro)) return { sucesso: false, mensagem: "Erro: o ID do Livro informado é inválido." }

        const exemplar = await serviceCriarExemplar(idLivro)
        return { sucesso: true, mensagem: "Exemplar cadastrado com sucesso!", dados: exemplar }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Exemplar') }
    }
}

export async function controllerAtualizarStatusExemplar(id: string, status: string): Promise<ControllerResponse> {
    try {
        const idExemplar = limparId(id);
        if (isNaN(idExemplar)) return { sucesso: false, mensagem: "Erro: o ID do Exemplar informado é inválido." }

        const statusValido = ['Disponivel', 'Emprestado', 'Manutencao', 'Extraviado'].includes(status)
        if (!statusValido) return { sucesso: false, mensagem: "Erro: status inválido." }

        await serviceAtualizarStatusExemplar(idExemplar, status as StatusExemplar)
        return { sucesso: true, mensagem: "Status do exemplar atualizado!" }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Exemplar') }
    }
}

export async function controllerDeletarExemplar(id: string): Promise<ControllerResponse> {
    try {
        const idExemplar = limparId(id)
        if (isNaN(idExemplar)) return { sucesso: false, mensagem: "Erro: o ID do Exemplar informado é inválido." }

        await serviceDeletarExemplar(idExemplar)
        return { sucesso: true, mensagem: "Exemplar excluído com sucesso!" }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Exemplar') }
    }
}

export async function controllerVerificarDisponibilidade(id: string): Promise<ControllerResponse> {
    try {
        const idExemplar = limparId(id);
        if (isNaN(idExemplar)) return { sucesso: false, mensagem: "Erro: o ID do Exemplar informado é inválido." };

        await serviceValidarDisponibilidadeParaEmprestimo(idExemplar);
        return { sucesso: true, mensagem: "Exemplar disponível para empréstimo." }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Exemplar') }
    }
}
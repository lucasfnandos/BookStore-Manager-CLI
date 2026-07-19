import { ControllerResponse } from "../models/Types"
import {
    serviceRelatorioLivrosDisponiveis,
    serviceRelatorioLivrosEmprestados,
    serviceRelatorioLivrosPorAutor,
    serviceRelatorioTotalEmprestimosPorLivro,
    serviceRelatorioClientesComEmprestimosAtivos
} from "../services/Relatorios"
import { traduzirErro } from "../utils/errorMessages"

export async function controllerRelatorioLivrosDisponiveis(): Promise<ControllerResponse> {
    try {
        const dados = await serviceRelatorioLivrosDisponiveis()
        return { 
            sucesso: true, 
            mensagem: "Relatório de Livros Disponíveis gerado com sucesso.", 
            dados 
        }
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Relatório' as any) }
    }
}

export async function controllerRelatorioLivrosEmprestados(): Promise<ControllerResponse> {
    try {
        const dados = await serviceRelatorioLivrosEmprestados();
        return { 
            sucesso: true, 
            mensagem: "Relatório de Livros Emprestados gerado com sucesso.", 
            dados 
        };
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Relatório' as any) }
    }
}

export async function controllerRelatorioLivrosPorAutor(): Promise<ControllerResponse> {
    try {
        const dados = await serviceRelatorioLivrosPorAutor();
        return { 
            sucesso: true, 
            mensagem: "Relatório de Livros por Autor gerado com sucesso.", 
            dados 
        };
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Relatório' as any) }
    }
}

export async function controllerRelatorioTotalEmprestimosPorLivro(): Promise<ControllerResponse> {
    try {
        const dados = await serviceRelatorioTotalEmprestimosPorLivro()
        return { 
            sucesso: true, 
            mensagem: "Relatório Histórico de Empréstimos gerado com sucesso.", 
            dados 
        };
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Relatório' as any) }
    }
}

export async function controllerRelatorioClientesComEmprestimosAtivos(): Promise<ControllerResponse> {
    try {
        const dados = await serviceRelatorioClientesComEmprestimosAtivos();
        return { 
            sucesso: true, 
            mensagem: "Relatório de Clientes com Empréstimos Ativos gerado com sucesso.", 
            dados 
        };
    } catch (err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Relatório' as any) }
    }
}
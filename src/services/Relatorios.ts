import { 
    repositoryRelatorioLivrosDisponiveis,
    repositoryRelatorioLivrosEmprestados,
    repositoryRelatorioLivrosPorAutor,
    repositoryRelatorioTotalEmprestimosPorLivro,
    repositoryRelatorioClientesComEmprestimosAtivos
    
} from "../repositories/Relatorios";
import {
    RelatorioLivrosDisponiveis,
    RelatorioLivrosEmprestados,
    RelatorioLivrosPorAutor,
    RelatorioTotalEmprestimos,
    RelatorioClientesAtivos
} from "../models/Relatorios"

export async function serviceRelatorioLivrosDisponiveis(): Promise<RelatorioLivrosDisponiveis[]> {
    return await repositoryRelatorioLivrosDisponiveis();
}

export async function serviceRelatorioLivrosEmprestados(): Promise<RelatorioLivrosEmprestados[]> {
    return await repositoryRelatorioLivrosEmprestados();
}

export async function serviceRelatorioLivrosPorAutor(): Promise<RelatorioLivrosPorAutor[]> {
    return await repositoryRelatorioLivrosPorAutor();
}

export async function serviceRelatorioTotalEmprestimosPorLivro(): Promise<RelatorioTotalEmprestimos[]> {
    return await repositoryRelatorioTotalEmprestimosPorLivro();
}

export async function serviceRelatorioClientesComEmprestimosAtivos(): Promise<RelatorioClientesAtivos[]> {
    return await repositoryRelatorioClientesComEmprestimosAtivos();
}
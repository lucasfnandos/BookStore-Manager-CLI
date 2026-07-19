export interface RelatorioLivrosDisponiveis {
    titulo: string;
    sub_titulo: string | null;
    edicao: number;
    ano: Date;
    autor: string;
    qtd: number;
}

export interface RelatorioLivrosEmprestados {
    titulo: string;
    qtd: number;
}

export interface RelatorioLivrosPorAutor {
    nome: string;
    nacionalidade: string;
    qtd: number;
}

export interface RelatorioTotalEmprestimos {
    titulo: string;
    autor: string;
    total_emprestimos: number;
}

export interface RelatorioClientesAtivos {
    nome: string;
    email: string;
    qtd_emprestimos_ativos: number;
}

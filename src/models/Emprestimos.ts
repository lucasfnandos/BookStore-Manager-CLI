export interface Emprestimos {
    id: number;
    cliente_id: number;
    exemplar_id: number;
    emprestado_em: Date;
    prazo_devolucao: Date;
    devolvido_em?: Date | null;
}

export interface EmprestimoDetalhado extends Emprestimos {
    cliente_nome: string;
    autor_nome: string;
    titulo: string;
    edicao: string;
    isbn: string;
}
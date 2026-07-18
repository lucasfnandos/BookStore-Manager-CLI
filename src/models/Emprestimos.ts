export interface Emprestimos {
    id: number;
    cliente_id: number;
    exemplar_id: number;
    emprestado_em: Date;
    prazo_devolucao: Date;
    devolvido_em?: Date | null;
}

export type StatusExemplar = 'Disponivel' | 'Emprestado' | 'Manutencao' | 'Extraviado';

export interface Exemplares {
    id: number;
    livro_id: number;
    cadastrado_em: Date;
    status: StatusExemplar;
}
export interface Livros{
    id: number;
    autor_id: number;
	titulo: string;
	sub_titulo: string | null;
	editora: string;
	publicado_em: number;
	edicao: number;
	formato: string;
	isbn: string;
    genero: string;
}
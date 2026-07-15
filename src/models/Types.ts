export type ControllerResponse = {
    sucesso: boolean;
    mensagem: string;
    dados?: any;
}

export type EntidadeDoSistema = 'Autor' | 'Cliente' | 'Livro' | 'Exemplar' | 'Empréstimo';

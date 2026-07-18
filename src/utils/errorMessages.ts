import { EntidadeDoSistema } from "../models/Types";

export function traduzirErro(erro: any, entidade: EntidadeDoSistema): string {
    
    switch (erro.message) {
        case "ENTIDADE_JA_EXISTE":
            return `Já existe um(a) ${entidade} com estes dados cadastrado(a) no sistema.`;
            
        case "ID_NAO_ENCONTRADO":
            return `${entidade} não encontrado(a) no sistema.`;

        case "EXEMPLAR_INDISPONIVEL":
            return `Este exemplar não está disponível para empréstimo no momento.`;

        case "EXEMPLAR_EM_USO":
            return `Não é possível excluir este exemplar pois ele está atualmente emprestado.`;

        case "CLIENTE_COM_LIMITE_ATINGIDO":
            return `Este cliente já atingiu o limite máximo de 2 empréstimos ativos.`;

        case "CLIENTE_JA_POSSUI_LIVRO":
            return `Este cliente já possui um exemplar desta mesma obra emprestado.`;
            
        case "DB_RETORNO_NULO":
        case "FALHA_AO_DELETAR":
        case "FALHA_AO_ATUALIZAR":
            return `Ocorreu uma falha ao tentar atualizar o registro de ${entidade} no banco de dados.`;
    }

    if (erro.code === '23505') {
        return `Não foi possível salvar. Já existe um(a) ${entidade} com este dado único restrito no sistema.`;
    }

    if (erro.code === '23503') {
        return `Não é possível excluir este(a) ${entidade} pois existem outros registros dependentes vinculados a ele(a).`;
    }

    if (erro.code === 'ECONNREFUSED' || erro.code === '57P03') {
        return `Sistema temporariamente indisponível. Falha na conexão com o banco de dados.`;
    }

    return `Ocorreu um erro interno inesperado ao processar a requisição de ${entidade}.`;
}
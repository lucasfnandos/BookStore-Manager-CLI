import { EntidadeDoSistema } from "../models/Types";

export function traduzirErro(erro: any, entidade: EntidadeDoSistema): string {
    
    switch (erro.message) {
        case "ENTIDADE_JA_EXISTE":
            return `Já existe um(a) ${entidade} com estes dados cadastrado(a) no sistema.`;
            
        case "ID_NAO_ENCONTRADO":
            return `${entidade} não encontrado(a) no sistema. Verifique o ID e tente novamente.`;
            
        case "DB_RETORNO_NULO":
        case "FALHA_AO_DELETAR":
            return `Ocorreu uma falha ao tentar efetivar a operação para este(a) ${entidade} no banco de dados.`;
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
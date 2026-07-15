import {
    serviceCriarAutor,
    serviceAtualizarAutor,
    serviceBuscarAutorPorNome,
    serviceDeletarAutor
} from "../services/Autores"
import { ControllerResponse } from "../models/Types"

export async function controllerCriarAutor(nome:string, nacionalidade:string, data_nascimento:string):Promise<ControllerResponse> {
    try {
        //SANITIZAR OS DADOS PRIMEIRA LETRA DA PALAVRA MAIUSCULA DEMAIS MINUSCULA SEM ESPAÇOS EM BRANCO NO FINAL E INICIO .TRIM()
        const nomeLimp = limparTexto(nome)
        const nacionalidadeLimp = limparTexto(nacionalidade)
        const data_nascimentoLimp = limparData(data_nascimento)
        //APOS SANITIZAR SEGUE:

        //VALIDAR OS DADOS DE ENTRADA VAZIO OU NUMEROS ONDE DEVERIA SER LETRAS VERIFICAR QUANTIDADE DE CARACTERES
        if(!nomeLimp || !nacionalidadeLimp || !data_nascimentoLimp) return { sucesso: false, mensagem: "Dado vazio ou não informado." }
        if(nomeLimp.length < 3) return { sucesso: false, mensagem: "Nome informado é muito curto." }
        if(nacionalidadeLimp.length < 3) return { sucesso: false, mensagem: "Nacionalidade informada é muito curta." }
        
        const dataNascimento = new Date(data_nascimentoLimp)
        if (isNaN(dataNascimento.getTime())) return { sucesso: false, mensagem: "A data informada é inválida." }

        const nomeCap = capitalizarNome(nomeLimp)
        const nacionalidadeCap = capitalizarNome(nacionalidadeLimp)
        //IF(DADOS OK) SEGUE:

        const criarAutor = await serviceCriarAutor(nomeCap, nacionalidadeCap, dataNascimento)
        return { sucesso: true, mensagem: "Sucesso!", dados: criarAutor }
    } catch(err: any) {
        const mensagemAmigavel = traduzirErro(err, 'Autor')
        return { sucesso: false, mensagem: mensagemAmigavel}
    }
}
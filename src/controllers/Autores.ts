import {
    serviceCriarAutor,
    serviceAtualizarAutor,
    serviceBuscarAutorPorNome,
    serviceDeletarAutor
} from "../services/Autores"
import { ControllerResponse } from "../models/Types"
import {
    limparTexto,
    limparData,
    capitalizarNome,
    limparId
} from "../utils/sanitizers"
import { traduzirErro } from "../utils/errorMessages"

export async function controllerCriarAutor(nome:string, nacionalidade:string, data_nascimento:string):Promise<ControllerResponse> {
    try {
        const nomeLimp = limparTexto(nome)
        const nacionalidadeLimp = limparTexto(nacionalidade)
        const data_nascimentoLimp = limparData(data_nascimento)
       
        if(!nomeLimp || !nacionalidadeLimp || !data_nascimentoLimp) return { sucesso: false, mensagem: "Dado vazio ou não informado." }
        if(nomeLimp.length < 3) return { sucesso: false, mensagem: "Nome informado é muito curto." }
        if(nacionalidadeLimp.length < 3) return { sucesso: false, mensagem: "Nacionalidade informada é muito curta." }
        
        const dataNascimento = new Date(data_nascimentoLimp)
        if (isNaN(dataNascimento.getTime())) return { sucesso: false, mensagem: "A data informada é inválida." }

        const nomeCap = capitalizarNome(nomeLimp)
        const nacionalidadeCap = capitalizarNome(nacionalidadeLimp)

        const criarAutor = await serviceCriarAutor(nomeCap, nacionalidadeCap, dataNascimento)
        return { sucesso: true, mensagem: "Sucesso!", dados: criarAutor }
    } catch(err: any) {
        const mensagemAmigavel = traduzirErro(err, 'Autor')
        return { sucesso: false, mensagem: mensagemAmigavel}
    }
}

export async function controllerAtualizarAutor(id:string, nome?:string, nacionalidade?:string, data_nascimento?:string):Promise<ControllerResponse> {
    try {
        const idValido = limparId(id)
        if(isNaN(idValido)) return { sucesso: false, mensagem: "Erro: o id informado é inválido."}
        
        if(!nome && !nacionalidade && !data_nascimento) return { sucesso: false, mensagem: "Erro: nenhum dado foi enviado para atualização." }
        
        let nomeFinal: string | undefined = undefined
        if(nome) {
            nomeFinal = capitalizarNome(nome); // Note que usei capitalizarNome aqui, é melhor para nomes!
            if(!nomeFinal || nomeFinal.length < 3) return { sucesso: false, mensagem: "Erro: o nome informado é inválido." }
        }
        
        let nacionalidadeFinal: string | undefined = undefined
        if(nacionalidade) {
            nacionalidadeFinal = limparTexto(nacionalidade)
            if(!nacionalidadeFinal || nacionalidadeFinal.length < 3) return { sucesso: false, mensagem: "Erro: a nacionalidade informada é inválida." }
        }

        let data_nascimentoFinal: Date | undefined = undefined
        if(data_nascimento) {
            const data_nascimentoLimp = limparData(data_nascimento)
            const dataDate = new Date(data_nascimentoLimp)
            if(!dataDate || isNaN(dataDate.getTime())) {
                return { sucesso: false, mensagem: "Erro: a data informada é inválida. Use DD/MM/AAAA." }
            }
            data_nascimentoFinal = dataDate
        }

        const autorEditado = await serviceAtualizarAutor(idValido, nomeFinal, nacionalidadeFinal, data_nascimentoFinal)
        return { sucesso: true, mensagem: "Autor atualizado com sucesso!", dados: autorEditado }

    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Autor')}
    }
}

export async function controllerBuscarAutorPorNome(nome:string): Promise<ControllerResponse> {
    try {
        const nomeLimp = limparTexto(nome)
        if(!nomeLimp) return { sucesso: false, mensagem: "Erro: o Nome informado é inválido." }
        const buscarAutor = await serviceBuscarAutorPorNome(nomeLimp)
        if(buscarAutor.length === 0) return { sucesso: false, mensagem: "Nenhum Autor foi encontrado com esse nome." }
        return { sucesso: true, mensagem: "Autores encontrados com esse nome...", dados: buscarAutor }
    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Autor')}
    }
}

export async function controllerDeletarAutor(id:string): Promise<ControllerResponse> {
    try {
        const idValido = limparId(id)
        if(isNaN(idValido)) return { sucesso: false, mensagem: "Erro: o ID informado é inválido." }
        const deletarAutor = await serviceDeletarAutor(idValido)
        if(!deletarAutor) return { sucesso: false, mensagem: "Erro: não foi possível deletar o Autor." }
        return { sucesso: true, mensagem: "Sucesso: as informações do autor foram removidas." }

    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Autor')}
    }
}

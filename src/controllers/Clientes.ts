import {
    serviceCriarCliente,
    serviceAtualizarCliente,
    serviceBuscarClientePorNome,
    serviceDeletarCliente
} from "../services/Clientes"
import { ControllerResponse } from "../models/Types"
import {
    limparTexto,
    limparData,
    capitalizarNome,
    limparId,
    apenasNumeros,
    limparEmail
} from "../utils/sanitizers"
import { traduzirErro } from "../utils/errorMessages"
import { ehEmailValido } from "../utils/validators"

export async function controllerCriarCliente(nome:string, cpf:string, email:string, contato:string, data_nascimento:string):Promise<ControllerResponse> {
    try {
        const nomeLimp = limparTexto(nome)
        const cpfLimp = apenasNumeros(cpf)
        const emailLimp = limparEmail(email)
        const contatoLimp = apenasNumeros(contato)
        const data_nascimentoLimp = limparData(data_nascimento)
       
        if(!nomeLimp || !cpfLimp || !emailLimp || !contatoLimp || !data_nascimentoLimp) return { sucesso: false, mensagem: "Erro: Dado vazio ou não informado." }
        if(nomeLimp.length < 3) return { sucesso: false, mensagem: "Erro: o nome informado é muito curto." }
        if(cpfLimp.length !== 11) return { sucesso: false, mensagem: "Erro: o CPF informado é inválido." }
        if(!ehEmailValido(emailLimp)) return { sucesso: false, mensagem: "Erro: o email informado é inválido." }
        if(contatoLimp.length !== 11) return { sucesso: false, mensagem: "Erro: o contato informado é inválido." }
        
        const dataNascimento = new Date(data_nascimentoLimp)
        if (isNaN(dataNascimento.getTime())) return { sucesso: false, mensagem: "Erro: a data informada é inválida." }

        const nomeCap = capitalizarNome(nomeLimp)

        const criarCliente = await serviceCriarCliente(nomeCap, cpfLimp, emailLimp, contatoLimp, dataNascimento)
        return { sucesso: true, mensagem: "Sucesso!", dados: criarCliente }
    } catch(err: any) {
        const mensagemAmigavel = traduzirErro(err, 'Cliente')
        return { sucesso: false, mensagem: mensagemAmigavel}
    }
}

export async function controllerAtualizarCliente(id:string, nome?:string, cpf?:string, email?:string, contato?:string, data_nascimento?:string):Promise<ControllerResponse> {
    try {
        const idValido = limparId(id)
        if(isNaN(idValido)) return { sucesso: false, mensagem: "Erro: o id informado é inválido."}
        
        if(!nome && !cpf && !email && !contato && !data_nascimento) return { sucesso: false, mensagem: "Erro: nenhum dado foi enviado para atualização." }
        
        let nomeFinal: string | undefined = undefined
        if(nome) {
            nomeFinal = capitalizarNome(nome);
            if(!nomeFinal || nomeFinal.length < 3) return { sucesso: false, mensagem: "Erro: o nome informado é inválido." }
        }
        
        let cpfFinal: string | undefined = undefined
        if(cpf) {
            cpfFinal = apenasNumeros(cpf)
            if(!cpfFinal || cpfFinal.length !== 11) return { sucesso: false, mensagem: "Erro: o CPF informado é inválido." }
        }

        let emailFinal: string | undefined = undefined
        if(email) {
            emailFinal = limparEmail(email)
            if(!emailFinal || !ehEmailValido(emailFinal)) return { sucesso: false, mensagem: "Erro: o email informado é inválido." }
        }

        let contatoFinal: string | undefined = undefined
        if(contato) {
            contatoFinal = apenasNumeros(contato)
            if(!contatoFinal || contatoFinal.length !== 11) return { sucesso: false, mensagem: "Erro: o contato informado é inválido. Use DD+Numero sem pontos nem espaços." }
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

        const clienteEditado = await serviceAtualizarCliente(idValido, nomeFinal, cpfFinal, emailFinal, contatoFinal, data_nascimentoFinal)
        return { sucesso: true, mensagem: "Cliente atualizado com sucesso!", dados: clienteEditado }

    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Cliente')}
    }
}

export async function controllerBuscarClientePorNome(nome:string): Promise<ControllerResponse> {
    try {
        const nomeLimp = limparTexto(nome)
        if(!nomeLimp) return { sucesso: false, mensagem: "Erro: o Nome informado é inválido." }
        const buscarCliente = await serviceBuscarClientePorNome(nomeLimp)
        if(buscarCliente.length === 0) return { sucesso: false, mensagem: "Nenhum Cliente foi encontrado com esse nome." }
        return { sucesso: true, mensagem: "Clientes encontrados com esse nome...", dados: buscarCliente }
    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Cliente')}
    }
}

export async function controllerDeletarCliente(id:string): Promise<ControllerResponse> {
    try {
        const idValido = limparId(id)
        if(isNaN(idValido)) return { sucesso: false, mensagem: "Erro: o ID informado é inválido." }
        const deletarCliente = await serviceDeletarCliente(idValido)
        if(!deletarCliente) return { sucesso: false, mensagem: "Erro: não foi possível deletar o Cliente." }
        return { sucesso: true, mensagem: "Sucesso: as informações do cliente foram removidas." }

    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Cliente')}
    }
}

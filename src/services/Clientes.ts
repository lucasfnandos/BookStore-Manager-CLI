import { Clientes } from "../models/Clientes";
import { 
    repositoryCriarCliente, 
    repositoryBuscarClientePorId,
    repositoryBuscarClientePorNome,
    repositoryAtualizarCliente,
    repositoryDeletarCliente,
    repositoryExisteCliente
} from "../repositories/Clientes";

export async function serviceCriarCliente(nome:string, cpf:string, email:string, contato:string, data_nascimento:Date): Promise<Clientes> {
    const clienteExiste = await repositoryExisteCliente(cpf, email);
    if (clienteExiste) {
        throw new Error("ENTIDADE_JA_EXISTE");
    }
    
    const id = await repositoryCriarCliente(nome, cpf, email, contato, data_nascimento); 
    if (!id) {
        throw new Error("DB_RETORNO_NULO");
    } 
    
    return { id, nome, cpf, email, contato, data_nascimento };
}

export async function serviceAtualizarCliente(id: number, nome?: string, cpf?:string, email?:string, contato?:string, data_nascimento?:Date): Promise<Clientes> {
    const clienteExistente = await repositoryBuscarClientePorId(id);
    if (!clienteExistente) {
        throw new Error("ID_NAO_ENCONTRADO");
    }
    
    const nomeFinal = nome || clienteExistente.nome;
    const cpfFinal = cpf || clienteExistente.cpf;
    const emailFinal = email || clienteExistente.email;
    const contatoFinal = contato || clienteExistente.contato;
    const dataNascimentoFinal = data_nascimento || clienteExistente.data_nascimento;


    
    const atualizado = await repositoryAtualizarCliente(id, nomeFinal, cpfFinal, emailFinal, contatoFinal, dataNascimentoFinal);
    if (!atualizado) {
        throw new Error("DB_RETORNO_NULO");
    }
    
    return { id, nome: nomeFinal, cpf: cpfFinal, email: emailFinal, contato: contatoFinal, data_nascimento: dataNascimentoFinal };
}

export async function serviceBuscarClientePorNome(nome: string): Promise<Clientes[]> {
    const clientes = await repositoryBuscarClientePorNome(nome);
    return clientes;
}

export async function serviceDeletarCliente(id: number): Promise<boolean> {
    const clienteExistente = await repositoryBuscarClientePorId(id);
    if (!clienteExistente) {
        throw new Error("ID_NAO_ENCONTRADO");
    }
    
    const deletado = await repositoryDeletarCliente(id);
    if (!deletado) {
        throw new Error("FALHA_AO_DELETAR");
    }
    
    return true;
}
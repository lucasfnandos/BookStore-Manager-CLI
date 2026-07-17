import { Livros } from "../models/Livros";
import { 
    repositoryCriarLivro, 
    repositoryBuscarLivroPorId,
    repositoryBuscarLivroPorAutorId,
    repositoryAtualizarLivro,
    repositoryDeletarLivro,
    repositoryExisteLivro
} from "../repositories/Livros";

export async function serviceCriarLivro(autor_id:number, titulo:string, editora:string, publicado_em:Date, edicao:number, isbn:string, formato?:string, sub_titulo?:string, genero?:string): Promise<Livros> {
    const livroExiste = await repositoryExisteLivro(isbn);
    if (livroExiste) {
        throw new Error("ENTIDADE_JA_EXISTE");
    }

    const novoFormato = formato || 'brochura'
    const novoGenero = genero || 'Não informado'
    const subTitulo = sub_titulo ?? null
    
    const id = await repositoryCriarLivro(autor_id, titulo, subTitulo, editora, publicado_em, edicao, novoFormato, isbn, novoGenero); 
    if (!id) {
        throw new Error("DB_RETORNO_NULO");
    } 
    
    return { id, autor_id, titulo, sub_titulo, editora, publicado_em, edicao, formato, isbn, genero };
}

export async function serviceAtualizarCliente(id: number, nome?: string, cpf?:string, email?:string, contato?:string, data_nascimento?:Date): Promise<Livros> {
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

export async function serviceBuscarClientePorNome(nome: string): Promise<Livros[]> {
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
import { Livros } from "../models/Livros";
import { 
    repositoryCriarLivro, 
    repositoryBuscarLivroPorId,
    repositoryBuscarLivroPorAutorId,
    repositoryAtualizarLivro,
    repositoryDeletarLivro,
    repositoryExisteLivro,
    repositoryBuscarLivroPorTitulo
} from "../repositories/Livros";

export async function serviceCriarLivro(autor_id:number, titulo:string, editora:string, publicado_em:number, edicao:number, isbn:string, formato?:string, sub_titulo?:string, genero?:string): Promise<Livros> {
    const livroExiste = await repositoryExisteLivro(isbn);
    if (livroExiste) {
        throw new Error("ENTIDADE_JA_EXISTE");
    }

    const novoFormato = formato || 'brochura'
    const novoGenero = genero || 'Não informado'
    const subTitulo = sub_titulo ?? null
    
    const id = await repositoryCriarLivro(autor_id, titulo, subTitulo, editora, publicado_em, edicao, novoFormato, isbn, novoGenero) 
    if (!id) {
        throw new Error("DB_RETORNO_NULO")
    }
    
    return { id, autor_id, titulo, sub_titulo:subTitulo, editora, publicado_em, edicao, formato:novoFormato, isbn, genero:novoGenero }
}

export async function serviceAtualizarLivro(id:number, autor_id?:number, titulo?:string, editora?:string, publicado_em?:number, edicao?:number, isbn?:string, formato?:string, sub_titulo?:string, genero?:string): Promise<Livros> {
    const livroExistente = await repositoryBuscarLivroPorId(id);
    if (!livroExistente) {
        throw new Error("ID_NAO_ENCONTRADO");
    }
    
    const autorIdFinal = autor_id || livroExistente.autor_id
    const tituloFinal = titulo || livroExistente.titulo
    const subTituloFinal = sub_titulo || livroExistente.sub_titulo
    const editoraFinal = editora || livroExistente.editora
    const publicacaoFinal = publicado_em || livroExistente.publicado_em
    const edicaoFinal = edicao || livroExistente.edicao
    const formatoFinal = formato || livroExistente.formato
    const isbnFinal = isbn || livroExistente.isbn
    const generoFinal = genero || livroExistente.genero


    
    const atualizado = await repositoryAtualizarLivro(id, autorIdFinal, tituloFinal, subTituloFinal, editoraFinal, publicacaoFinal, edicaoFinal, formatoFinal, isbnFinal, generoFinal);
    if (!atualizado) {
        throw new Error("DB_RETORNO_NULO");
    }
    
    return { id, autor_id: autorIdFinal, titulo: tituloFinal, sub_titulo: subTituloFinal, editora: editoraFinal, publicado_em: publicacaoFinal, edicao: edicaoFinal, formato: formatoFinal, isbn: isbnFinal, genero: generoFinal };
}

export async function serviceBuscarLivroPorTitulo(titulo: string): Promise<Livros[]> {
    const listaDeLivros = await repositoryBuscarLivroPorTitulo(titulo);
    return listaDeLivros;
}

export async function serviceDeletarLivro(id: number): Promise<boolean> {
    const livroExistente = await repositoryBuscarLivroPorId(id);
    if (!livroExistente) {
        throw new Error("ID_NAO_ENCONTRADO");
    }
    const deletado = await repositoryDeletarLivro(id);
    if (!deletado) {
        throw new Error("FALHA_AO_DELETAR");
    }
    return true;
}

export async function serviceBuscarLivroPorAutorId(autor_id:number): Promise<Livros[]> {
    const livrosDoAutor = await repositoryBuscarLivroPorAutorId(autor_id)
    if(!livrosDoAutor) {
        throw new Error("ID_NAO_ENCONTRADO")
    }
    return livrosDoAutor
}
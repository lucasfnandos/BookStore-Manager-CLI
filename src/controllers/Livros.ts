import {
    serviceCriarLivro,
    serviceAtualizarLivro,
    serviceBuscarLivroPorTitulo,
    serviceBuscarLivroPorAutorId,
    serviceDeletarLivro
} from "../services/Livros"
import { ControllerResponse } from "../models/Types"
import {
    limparTexto,
    capitalizarNome,
    limparId,
    apenasNumeros
} from "../utils/sanitizers"
import { ehAnoValido } from "../utils/validators"
import { traduzirErro } from "../utils/errorMessages"

export async function controllerCriarLivro(autor_id:string, titulo:string, editora:string, publicado_em:string, edicao:string, isbn:string, formato:string, sub_titulo:string, genero:string):Promise<ControllerResponse> {
    try {
        const autorId = limparId(autor_id)
        const tituloLimp = limparTexto(titulo)
        const editoraLimp = limparTexto(editora)
        const edicaoLimp = apenasNumeros(edicao)
        const isbnLimp = apenasNumeros(isbn)
        const publicLimp = apenasNumeros(publicado_em)
        const formatoLimp = limparTexto(formato)
        const generoLimp = limparTexto(genero)
        const subTituloLimp = limparTexto(sub_titulo)
        
        if(isNaN(autorId)) return { sucesso: false, mensagem: "Erro: o id do Autor informado é inválido." }
        if(!tituloLimp || !editoraLimp || !edicaoLimp || !publicLimp || !isbnLimp) return { sucesso: false, mensagem: "Erro: Dado vazio ou não informado." }
        if(tituloLimp.length < 1) return { sucesso: false, mensagem: "Erro: o título não foi informado." }
        if(editoraLimp.length < 1) return { sucesso: false, mensagem: "Erro: a editora não foi informada." }
        if(edicaoLimp.length < 1) return { sucesso: false, mensagem: "Erro: a edição não foi informada." }
        if(!ehAnoValido(publicLimp)) return { sucesso: false, mensagem: "Erro: o ano de publicação informado é inválido." }
        
        const subTitulo = subTituloLimp === "" ? undefined : subTituloLimp
        const edicaoNum = Number(edicaoLimp)
        const tituloCap = capitalizarNome(tituloLimp)
        const anoPublic = parseInt(publicLimp, 10)
        const criarLivro = await serviceCriarLivro(autorId, tituloCap, editoraLimp, anoPublic, edicaoNum, isbnLimp, formatoLimp, subTitulo, generoLimp)
        return { sucesso: true, mensagem: "Sucesso!", dados: criarLivro }
    } catch(err: any) {
        const mensagemAmigavel = traduzirErro(err, 'Livro')
        return { sucesso: false, mensagem: mensagemAmigavel}
    }
}

export async function controllerAtualizarLivro(id:string, autor_id?:string, titulo?:string, sub_titulo?:string, editora?:string, publicado_em?:string, edicao?:string, formato?:string, isbn?:string, genero?:string):Promise<ControllerResponse> {
    try {
        const idLivroValido = limparId(id)
        if(isNaN(idLivroValido)) return { sucesso: false, mensagem: "Erro: o ID do Livro informado é inválido."}
        
        let autorId: number | undefined = undefined
        if(autor_id) {
            autorId = limparId(autor_id)
            if(isNaN(autorId)) return { sucesso: false, mensagem: "Erro: o ID do Autor informado é inválido."}
        }
        
        if(!titulo && !autor_id && !sub_titulo && !editora && !publicado_em && !edicao && !formato && !isbn && !genero) return { sucesso: false, mensagem: "Erro: nenhum dado foi enviado para atualização." }
        
        let tituloFinal: string | undefined = undefined
        if(titulo) {
            tituloFinal = capitalizarNome(titulo);
            if(!tituloFinal) return { sucesso: false, mensagem: "Erro: o título informado é inválido." }
        }
        
        let editoraFinal: string | undefined = undefined
        if(editora) {
            editoraFinal = capitalizarNome(editora)
            if(!editoraFinal) return { sucesso: false, mensagem: "Erro: a editora informada é inválida." }
        }

        let publicFinal: number | undefined = undefined
        if(publicado_em) {
            const publicLimp = apenasNumeros(publicado_em)
            if(!ehAnoValido(publicLimp)) return { sucesso: false, mensagem: "Erro: o ano de edição informado é inválido." }
            publicFinal = Number(publicLimp)
        }

       let subTituloFinal: string | undefined = undefined;
        if (sub_titulo !== undefined) {
            subTituloFinal = sub_titulo.trim() !== "" ? capitalizarNome(sub_titulo) : undefined;
        }

        let edicaoFinal: number | undefined = undefined
        if(edicao) {
            edicaoFinal = Number(edicao)
            if(isNaN(edicaoFinal ) || !Number.isInteger(edicaoFinal) || edicaoFinal < 0) return { sucesso: false, mensagem: "Erro: a edição informada é inválida." }
        }

        let formatoFinal: string | undefined = undefined
        if(formato) {
            formatoFinal = limparTexto(formato)
            if(formatoFinal.length < 3) return { sucesso: false, mensagem: "Erro: o formato é inválido." }
        }

        let generoFinal: string | undefined = undefined
        if(genero) {
            generoFinal = capitalizarNome(genero)
            if(generoFinal.length < 2) return { sucesso: false, mensagem: "Erro: o gênero informado é inválido." }
        }

        let isbnFinal: string | undefined = undefined
        if(isbn) {
            isbnFinal = apenasNumeros(isbn)
            if (isbnFinal.length !== 10 && isbnFinal.length !== 13) return { sucesso: false, mensagem: "Erro: o ISBN informado é inválido." }
        }

        const livroEditado = await serviceAtualizarLivro(idLivroValido, autorId, tituloFinal, editoraFinal, publicFinal, edicaoFinal, isbnFinal, formatoFinal, subTituloFinal, generoFinal)
        return { sucesso: true, mensagem: "Livro atualizado com sucesso!", dados: livroEditado }

    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Livro')}
    }
}

export async function controllerBuscarLivroPorTitulo(titulo:string): Promise<ControllerResponse> {
    try {
        const tituloLimp = limparTexto(titulo)
        if(!tituloLimp) return { sucesso: false, mensagem: "Erro: o Titulo informado é inválido." }
        const buscarLivro = await serviceBuscarLivroPorTitulo(tituloLimp)
        if(buscarLivro.length === 0) return { sucesso: false, mensagem: "Nenhum Livro foi encontrado com esse nome." }
        return { sucesso: true, mensagem: "Livros encontrados com esse nome...", dados: buscarLivro }
    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Livro')}
    }
}

export async function controllerBurcarLivroPorAutorId(autor_id:string): Promise<ControllerResponse> {
    try {
        const idValido = limparId(autor_id)
        if(isNaN(idValido)) return { sucesso: false, mensagem: "Erro: o ID informado é inválido." }
        const listaLivros = await serviceBuscarLivroPorAutorId(idValido)
        return { sucesso: true, mensagem: "Livros encontrados deste Autor...", dados: listaLivros }
    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Cliente')}
    }
}
export async function controllerDeletarLivro(id:string): Promise<ControllerResponse> {
    try {
        const idValido = limparId(id)
        if(isNaN(idValido)) return { sucesso: false, mensagem: "Erro: o ID informado é inválido." }
        const deletarLivro = await serviceDeletarLivro(idValido)
        if(!deletarLivro) return { sucesso: false, mensagem: "Erro: não foi possível deletar o Livro." }
        return { sucesso: true, mensagem: "Sucesso: as informações do livro foram removidas." }

    } catch(err: any) {
        return { sucesso: false, mensagem: traduzirErro(err, 'Livro')}
    }
}

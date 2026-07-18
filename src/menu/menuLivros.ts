import {
    controllerAtualizarLivro,
    controllerBurcarLivroPorAutorId,
    controllerBuscarLivroPorTitulo,
    controllerCriarLivro,
    controllerDeletarLivro
} from "../controllers/Livros"
import {
    controllerBuscarAutorPorNome
} from "../controllers/Autores"
import { formatarDataPtBR } from "../utils/formatters";
import * as readline from 'readline/promises'


export async function iniciarMenuLivros(terminal: readline.Interface): Promise<void> {
    let rodando = true;
    while (rodando) {
        console.log('\n========== MENU LIVROS ==========')
        console.log('  1. CADASTRAR UM LIVRO')
        console.log('  2. EDITAR UM LIVRO')
        console.log('  3. EXCLUIR UM LIVRO')
        console.log('  4. PESQUISAR UM LIVRO')
        console.log('  0. VOLTAR AO MENU PRINCIPAL')
        console.log('==================================')

        const opcao = await terminal.question('\nDigite a opção desejada: ')
        switch (opcao.trim()) {
            case '1': {
                console.log("\n--- Cadastrar um Livro ---")
                console.log("\n---- ANTES DE CADASTRAR UM LIVRO É PRECISO BUSCAR O ID DO AUTOR ----")
                const buscarAutor = await terminal.question("Digite o nome do Autor: ")
                const listarAutores = await controllerBuscarAutorPorNome(buscarAutor)
                if(!listarAutores.sucesso) {
                    console.log(`\n ${listarAutores.mensagem}`)
                } else {
                    console.log(`\n ${listarAutores.mensagem}`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | Nacionalidade | Data de Nascimento")
                    const listaDeAutores = listarAutores.dados
                    
                    for(let autor of listaDeAutores) {
                        console.log(`${autor.id} | ${autor.nome} | ${autor.nacionalidade} | ${formatarDataPtBR(autor.data_nascimento)}`)
                    }
                    console.log("-------------------------------------------------------------------------")
                    console.log("\n>>>Identifique o ID do Autor na lista<<<")
                }
                const autorIdLivro = await terminal.question("Digite o ID do Autor: ")
                const tituloLivro = await terminal.question("Digite o título: ")
                const subTituloLivro = await terminal.question("Digite o sub titulo (enter para deixar em branco): ")
                const editoraLivro = await terminal.question("Digite e editora: ")
                const publicLivro = await terminal.question("Digite o ano de publicação (AAAA): ")
                const edicaoLivro = await terminal.question("Digite o número da edição: ")
                const isbnLivro = await terminal.question("Digite o ISBN (sem pontos nem traços): ")
                const formatoLivro = await terminal.question("Digite o formato (enter para deixar como brochura): ")
                const generoLivro = await terminal.question("Digite o gênero: ")

                const respostaCriar = await controllerCriarLivro(autorIdLivro, tituloLivro, editoraLivro, publicLivro, edicaoLivro, isbnLivro, formatoLivro, subTituloLivro, generoLivro)
                if (!respostaCriar.sucesso) {
                    console.log(`\n ${respostaCriar.mensagem}`)
                } else {
                    const Livro = respostaCriar.dados
                    console.log(`\n ${respostaCriar.mensagem}`)
                    console.log("---------------------------------------------------------------------------------------------")
                    console.log("ID | Autor ID | Titulo | Sub Título | Editora | Publicação | Edição | Formato | ISBN | Genero");
                    console.log(`${Livro.id} | ${Livro.autor_id} | ${Livro.titulo} | ${Livro.sub_titulo} | ${Livro.editora} | ${Livro.pubicado_em} | ${Livro.edicao} | ${Livro.formato} | ${Livro.isbn} | ${Livro.genero}`)
                    console.log("-------------------------------------------------------------------------")
                }
                break
            }
            case '2': {
                console.log("\n--- Busque o Livro a ser editado para identificar seu ID: ---")
                const buscarLivro = await terminal.question("Digite o título do Livro: ")
                const listarLivros = await controllerBuscarLivroPorTitulo(buscarLivro)
                
                if(!listarLivros.sucesso) {
                    console.log(`\n${listarLivros.mensagem}`)
                } else {
                    console.log(`\n${listarLivros.mensagem}`)
                    console.log("---------------------------------------------------------------------------------------------")
                    console.log("ID | Título | Editora | Publicação | Edição | ISBN | Gênero")
                    const lista = listarLivros.dados
                    for(let l of lista) {
                        console.log(`${l.id} | ${l.titulo} | ${l.editora} | ${l.publicado_em} | ${l.edicao} | ${l.isbn} | ${l.genero}`)
                    }
                    console.log("---------------------------------------------------------------------------------------------")
                    console.log("\n>>>Identifique o ID do Livro na lista<<<")

                    const idLivro = await terminal.question("\nDigite o ID do Livro a ser editado: ")
                    const titulo = await terminal.question("Novo título (ou Enter para manter o mesmo): ")
                    const subTitulo = await terminal.question("Novo sub-título (ou Enter para manter o mesmo): ")
                    const editora = await terminal.question("Nova editora (ou Enter para manter a mesma): ")
                    const ano = await terminal.question("Novo ano (ou Enter para manter o mesmo): ")
                    const edicao = await terminal.question("Nova edição (ou Enter para manter a mesma): ")
                    const isbn = await terminal.question("Novo ISBN (ou Enter para manter a mesma): ")
                    const formato = await terminal.question("Novo formato (ou Enter para manter a mesma): ")
                    const genero = await terminal.question("Novo gênero (ou Enter para manter o mesmo): ")
                    
                    const resp = await controllerAtualizarLivro(idLivro, undefined, titulo, subTitulo, editora, ano, edicao, formato, isbn, genero)
                    console.log(`\n${resp.mensagem}`)
                }
                break
            }
            case '3': {
                console.log("\n--- Busque o Livro a ser excluido para identificar seu ID: ---")
                const buscarLivro = await terminal.question("Digite o nome do Livro: ")
                const listarLivros = await controllerBuscarLivroPorTitulo(buscarLivro)
                if(!listarLivros.sucesso) {
                    console.log(`\n ${listarLivros.mensagem}`)
                } else {
                    console.log(`\n ${listarLivros.mensagem}`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | CPF | Email | Contato | Data de Nascimento")
                    const listaDeLivros= listarLivros.dados
                    
                    for(let Livro of listaDeLivros) {
                        console.log(`${Livro.id} | ${Livro.nome} | ${Livro.cpf} | ${Livro.email} | ${Livro.contato} | ${formatarDataPtBR(Livro.data_nascimento)}`)

                    }
                    console.log("-------------------------------------------------------------------------")
                    
                    const idLivro = await terminal.question("Digite o número do ID do Livro a ser excluido: ")
                    const respostaDeletar = await controllerDeletarLivro(idLivro)
                    console.log(`\n ${respostaDeletar.mensagem}`)
                }
                break
            }
            case '4': {
                console.log("\n--- Pesquisar Livros por Autor ---")
                const nomeAutor = await terminal.question("Digite o nome do Autor: ")
                const aut = await controllerBuscarAutorPorNome(nomeAutor)
                
                if(!aut.sucesso) {
                    console.log(`\n ${aut.mensagem}`)
                } else {
                    const autores = aut.dados
                    const anoAtual = new Date().getFullYear()

                    console.log(`\n Foram encontrados ${autores.length} autor(es):`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | Nacionalidade | Idade")
                    
                    for (const autor of autores) {
                        const anoNasc = new Date(autor.data_nascimento).getFullYear()
                        const idade = anoAtual - anoNasc
                        console.log(`${autor.id} | ${autor.nome} | ${autor.nacionalidade} | ${idade} anos`)
                    }
                    console.log("-------------------------------------------------------------------------")
                    
                    const idEscolhido = await terminal.question("\nDigite o ID do autor para listar seus livros: ")
                    const livros = await controllerBurcarLivroPorAutorId(idEscolhido)
                        
                    if(!livros.sucesso) {
                        console.log(`\n ${livros.mensagem}`)
                    } else {
                        console.log("\n Livros do autor escolhido:")
                        console.log("-------------------------------------------------------------------------")
                        console.log("ID | Título | Editora | Publicação | Edição | ISBN")
                        
                        for(let l of livros.dados) {
                            console.log(`${l.id} | ${l.titulo} | ${l.editora} | ${l.publicado_em} | ${l.edicao} | ${l.isbn}`)
                        }
                        console.log("-------------------------------------------------------------------------")
                    }
                }
            }
                break
            case '0': {
                console.log("\n Voltando ao Menu Principal...")
                rodando = false
                break
            }
            default:
                console.log("\n Opção inválida! Tente novamente.")
                break
        }
    }
}
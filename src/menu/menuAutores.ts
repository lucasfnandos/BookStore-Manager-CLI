import {
    controllerCriarAutor,
    controllerAtualizarAutor,
    controllerBuscarAutorPorNome,
    controllerDeletarAutor
} from "../controllers/Autores"
import { formatarDataPtBR } from "../utils/formatters"
import * as readline from 'readline/promises'


export async function iniciarMenuAutores(terminal: readline.Interface): Promise<void> {
    let rodando = true;
    while (rodando) {
        console.log('\n========== MENU AUTORES ==========')
        console.log('  1. CADASTRAR UM AUTOR')
        console.log('  2. EDITAR UM AUTOR')
        console.log('  3. EXCLUIR UM AUTOR')
        console.log('  4. PESQUISAR UM AUTOR')
        console.log('  0. VOLTAR AO MENU PRINCIPAL')
        console.log('==================================')

        const opcao = await terminal.question('\nDigite a opção desejada: ')
        switch (opcao.trim()) {
            case '1': {
                console.log("\n--- Cadastrar um Autor ---")
                const nomeAutor = await terminal.question("Digite o nome: ")
                const nacAutor = await terminal.question("Digite a nacionalidade: ")
                const dataAutor = await terminal.question("Digite a data de nascimento (DD/MM/AAAA): ")

                const respostaCriar = await controllerCriarAutor(nomeAutor, nacAutor, dataAutor)
                if (!respostaCriar.sucesso) {
                    console.log(`\n ${respostaCriar.mensagem}`)
                } else {
                    const autor = respostaCriar.dados
                    const anoAtual = new Date().getFullYear()
                    const anoNascimento = autor.data_nascimento.getFullYear()
                    const idadeAutor = anoAtual - anoNascimento

                    console.log(`\n ${respostaCriar.mensagem}`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | Nacionalidade | Data de Nascimento | Idade");
                    console.log(`${autor.id} | ${autor.nome} | ${autor.nacionalidade} | ${formatarDataPtBR(autor.data_nascimento)} | ${idadeAutor} anos`)
                    console.log("-------------------------------------------------------------------------")
                }
                break
            }
            case '2': {
                console.log("\n--- Busque o Autor a ser editado para identificar seu ID: ---")
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
                    
                    const idAutor = await terminal.question("Digite o número do ID do Autor a ser editado: ")
                    const nomeEditado = await terminal.question("Digite o nome do Autor a ser editado (ou Enter para manter o mesmo): ")
                    const naciEditado = await terminal.question("Digite o país do Autor a ser editado (ou Enter para manter o mesmo) ")
                    const dataNasEditado = await terminal.question("Digite a data de nascimento (DD/MM/AAAA) do Autor a ser editado (ou Enter para manter a mesma) ")
                    const respostaEditar = await controllerAtualizarAutor(idAutor, nomeEditado, naciEditado, dataNasEditado)
                    
                    if(!respostaEditar.sucesso) {
                        console.log(`\n ${respostaEditar.mensagem}`)
                    } else {
                        console.log(`\n ${respostaEditar.mensagem}`)
                        const autor = respostaEditar.dados
                        console.log("ID | Nome | Nacionalidade | Data de Nascimento");
                        console.log(`${autor.id} | ${autor.nome} | ${autor.nacionalidade} | ${formatarDataPtBR(autor.data_nascimento)}`)
                    }
                }
                break
            }
            case '3': {
                console.log("\n--- Busque o Autor a ser excluido para identificar seu ID: ---")
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
                    
                    const idAutor = await terminal.question("Digite o número do ID do Autor a ser excluido: ")
                    const respostaDeletar = await controllerDeletarAutor(idAutor)
                    console.log(`\n ${respostaDeletar.mensagem}`)
                }
                break
            }
            case '4': {
                console.log("\n--- Listar Autores por nome: ---")
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
                }
                break
            }
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
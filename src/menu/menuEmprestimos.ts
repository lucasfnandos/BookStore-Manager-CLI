import * as readline from 'readline/promises';
import {
    controllerCadastrarEmprestimo,
    controllerRegistrarDevolucao,
    controllerListarEmprestimosPorCliente,
    controllerBuscarLivrosPorAutorComDisponibilidade,
    controllerBuscarLivrosPorTituloComDisponibilidade
} from '../controllers/Emprestimos';
import { formatarDataPtBR } from '../utils/formatters';

export async function iniciarMenuEmprestimos(terminal: readline.Interface): Promise<void> {
    let rodando = true
    while (rodando) {
        console.log('\n========== MENU EMPRÉSTIMOS ==========')
        console.log('  1. REALIZAR EMPRÉSTIMO')
        console.log('  2. REGISTRAR DEVOLUÇÃO')
        console.log('  3. LISTAR EMPRÉSTIMOS ATIVOS DE UM CLIENTE')
        console.log('  4. CONSULTAR DISPONIBILIDADE DE LIVROS')
        console.log('  0. VOLTAR AO MENU PRINCIPAL')
        console.log('======================================')

        const opcao = await terminal.question('\nDigite a opção desejada: ')

        switch (opcao.trim()) {
            case '1': {
                console.log("\n--- Realizar Empréstimo ---")
                const idCliente = await terminal.question("Digite o ID do Cliente: ")
                const idExemplar = await terminal.question("Digite o ID do Exemplar que será emprestado: ")

                const resposta = await controllerCadastrarEmprestimo(idCliente, idExemplar)
                if (resposta.sucesso) {
                    console.log(`\n ${resposta.mensagem} (ID do Registro: ${resposta.dados.id})`)
                } else {
                    console.log(`\n ${resposta.mensagem}`);
                }
                break
            }

            case '2': {
                console.log("\n--- Registrar Devolução ---")
                const idEmprestimo = await terminal.question("Digite o ID do Registro de Empréstimo: ")
                const idExemplar = await terminal.question("Digite o ID do Exemplar devolvido: ")

                const resposta = await controllerRegistrarDevolucao(idEmprestimo, idExemplar)
                if (resposta.sucesso) {
                    console.log(`\n ${resposta.mensagem}`)
                } else {
                    console.log(`\n ${resposta.mensagem}`)
                }
                break
            }

            case '3': {
                console.log("\n--- Listar Empréstimos Ativos ---")
                const idCliente = await terminal.question("Digite o ID do Cliente: ")
                const resposta = await controllerListarEmprestimosPorCliente(idCliente)

                if (!resposta.sucesso) {
                    console.log(`\n ${resposta.mensagem}`)
                } else {
                    const emprestimos = resposta.dados
                    if (emprestimos.length === 0) {
                        console.log("\nNenhum empréstimo ativo encontrado para este cliente.")
                    } else {
                        console.log(`\n Empréstimos Ativos do Cliente: ${emprestimos[0].cliente_nome}`)
                        console.log("----------------------------------------------------------------------------------------");
                        console.log("ID Reg. | ID Exemp. | Título | Edição | Autor | ISBN")
                        for (const emp of emprestimos) {
                            console.log(`${emp.id} | ${emp.exemplar_id} | ${emp.titulo} | ${emp.edicao} | ${emp.autor_nome} | ${emp.isbn}`)
                        }
                        console.log("----------------------------------------------------------------------------------------")
                    }
                }
                break
            }

            case '4': {
                console.log("\n--- Consultar Disponibilidade de Livros ---")
                console.log("  1. Buscar por Título")
                console.log("  2. Buscar por ID do Autor")
                const subOpcao = await terminal.question("\nEscolha o tipo de busca: ")

                if (subOpcao.trim() === '1') {
                    const titulo = await terminal.question("Digite o título do livro (ou parte dele): ")
                    const resposta = await controllerBuscarLivrosPorTituloComDisponibilidade(titulo)
                    exibirTabelaDisponibilidade(resposta)
                } else if (subOpcao.trim() === '2') {
                    const idAutor = await terminal.question("Digite o ID do Autor: ")
                    const resposta = await controllerBuscarLivrosPorAutorComDisponibilidade(idAutor)
                    exibirTabelaDisponibilidade(resposta)
                } else {
                    console.log("\n Opção inválida.")
                }
                break
            }

            case '0':
                console.log("\nVoltando ao Menu Principal...")
                rodando = false
                break

            default:
                console.log("\n Opção inválida! Tente novamente.")
        }
    }
}

function exibirTabelaDisponibilidade(resposta: any) {
    if (!resposta.sucesso) {
        console.log(`\n ${resposta.mensagem}`)
        return
    }
    const livros = resposta.dados
    if (livros.length === 0) {
        console.log("\nNenhum livro encontrado para esta busca.")
        return
    }

    console.log(`\n ${resposta.mensagem}`)
    console.log("--------------------------------------------------------------------------------")
    console.log("ID Livro | Título | Edição | Publicado em | Qtd. Físicos Disponíveis")
    for (const l of livros) {
        const dataFormatada = formatarDataPtBR(l.publicado_em)
        console.log(`${l.id} | ${l.titulo} | ${l.edicao} | ${dataFormatada} | ${l.qtd_disponivel} exemplar(es)`)
    }
    console.log("--------------------------------------------------------------------------------")
}
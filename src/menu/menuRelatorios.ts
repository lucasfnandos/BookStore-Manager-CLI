import * as readline from 'readline/promises'
import {
    controllerRelatorioLivrosDisponiveis,
    controllerRelatorioLivrosEmprestados,
    controllerRelatorioLivrosPorAutor,
    controllerRelatorioTotalEmprestimosPorLivro,
    controllerRelatorioClientesComEmprestimosAtivos
} from '../controllers/Relatorios'
import { formatarDataPtBR } from '../utils/formatters'

export async function iniciarMenuRelatorios(terminal: readline.Interface): Promise<void> {
    let rodando = true

    while (rodando) {
        console.log('\n========== MENU RELATÓRIOS ==========');
        console.log('  1. LIVROS DISPONÍVEIS');
        console.log('  2. LIVROS ATUALMENTE EMPRESTADOS');
        console.log('  3. LIVROS CADASTRADOS POR AUTOR');
        console.log('  4. HISTÓRICO TOTAL DE EMPRÉSTIMOS POR LIVRO');
        console.log('  5. CLIENTES COM EMPRÉSTIMOS ATIVOS');
        console.log('  0. VOLTAR AO MENU PRINCIPAL');
        console.log('=====================================');

        const opcao = await terminal.question('\nDigite a opção desejada: ')

        switch (opcao.trim()) {
            case '1': {
                console.log("\n--- 1. Relatório de Livros Disponíveis ---")
                const resposta = await controllerRelatorioLivrosDisponiveis()
                
                if (!resposta.sucesso) {
                    console.log(`\nErro: ${resposta.mensagem}`)
                } else if (resposta.dados.length === 0) {
                    console.log("\nNão há livros disponíveis no momento.")
                } else {
                    console.log(`\n${resposta.mensagem}`)
                    console.log("--------------------------------------------------------------------------------------------------")
                    console.log("Título | Subtítulo | Edição | Publicado em | Autor | Qtd. Disponível");
                    for (const item of resposta.dados) {
                        const sub = item.sub_titulo ? item.sub_titulo : "-";
                        console.log(`${item.titulo} | ${sub} | ${item.edicao} | ${item.ano} | ${item.autor} | ${item.qtd}`);
                    }
                    console.log("--------------------------------------------------------------------------------------------------")
                }
                break
            }

            case '2': {
                console.log("\n--- 2. Relatório de Livros Atualmente Emprestados ---")
                const resposta = await controllerRelatorioLivrosEmprestados()
                
                if (!resposta.sucesso) {
                    console.log(`\nErro: ${resposta.mensagem}`)
                } else if (resposta.dados.length === 0) {
                    console.log("\nNenhum livro está emprestado no momento.")
                } else {
                    console.log(`\n${resposta.mensagem}`)
                    console.log("--------------------------------------------------")
                    console.log("Título | Qtd. Atualmente Emprestada")
                    for (const item of resposta.dados) {
                        console.log(`${item.titulo} | ${item.qtd}`)
                    }
                    console.log("--------------------------------------------------")
                }
                break
            }

            case '3': {
                console.log("\n--- 3. Relatório de Livros Cadastrados por Autor ---")
                const resposta = await controllerRelatorioLivrosPorAutor()
                
                if (!resposta.sucesso) {
                    console.log(`\nErro: ${resposta.mensagem}`)
                } else if (resposta.dados.length === 0) {
                    console.log("\nNenhum autor ou livro cadastrado.")
                } else {
                    console.log(`\n${resposta.mensagem}`)
                    console.log("--------------------------------------------------")
                    console.log("Autor | Nacionalidade | Qtd. Títulos Diferentes")
                    for (const item of resposta.dados) {
                        console.log(`${item.nome} | ${item.nacionalidade} | ${item.qtd}`)
                    }
                    console.log("--------------------------------------------------")
                }
                break
            }

            case '4': {
                console.log("\n--- 4. Histórico Total de Empréstimos por Livro ---")
                const resposta = await controllerRelatorioTotalEmprestimosPorLivro()
                
                if (!resposta.sucesso) {
                    console.log(`\nErro: ${resposta.mensagem}`)
                } else if (resposta.dados.length === 0) {
                    console.log("\nNenhum histórico de empréstimo encontrado.")
                } else {
                    console.log(`\n${resposta.mensagem}`)
                    console.log("--------------------------------------------------")
                    console.log("Título | Autor | Total Histórico de Empréstimos")
                    for (const item of resposta.dados) {
                        console.log(`${item.titulo} | ${item.autor} | ${item.total_emprestimos}`)
                    }
                    console.log("--------------------------------------------------")
                }
                break
            }

            case '5': {
                console.log("\n--- 5. Relatório de Clientes com Empréstimos Ativos ---")
                const resposta = await controllerRelatorioClientesComEmprestimosAtivos()
                
                if (!resposta.sucesso) {
                    console.log(`\nErro: ${resposta.mensagem}`)
                } else if (resposta.dados.length === 0) {
                    console.log("\nNenhum cliente possui empréstimos ativos no momento.")
                } else {
                    console.log(`\n${resposta.mensagem}`)
                    console.log("--------------------------------------------------")
                    console.log("Nome | Email | Qtd. Livros Retidos")
                    for (const item of resposta.dados) {
                        console.log(`${item.nome} | ${item.email} | ${item.qtd_emprestimos_ativos}`)
                    }
                    console.log("--------------------------------------------------")
                }
                break;
            }

            case '0':
                console.log("\nVoltando ao Menu Principal...")
                rodando = false
                break

            default:
                console.log("\nErro: Opção inválida! Tente novamente.")
        }
    }
}
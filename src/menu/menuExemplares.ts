import { 
    controllerCriarExemplar, 
    controllerAtualizarStatusExemplar, 
    controllerDeletarExemplar 
} from "../controllers/Exemplares"
import { controllerBuscarLivroPorTitulo } from "../controllers/Livros"
import * as readline from 'readline/promises'

export async function iniciarMenuExemplares(terminal: readline.Interface): Promise<void> {
    let rodando = true
    while (rodando) {
        console.log('\n========== MENU EXEMPLARES ==========');
        console.log('  1. CADASTRAR EXEMPLAR')
        console.log('  2. ATUALIZAR STATUS DE EXEMPLAR')
        console.log('  3. EXCLUIR EXEMPLAR')
        console.log('  0. VOLTAR AO MENU PRINCIPAL')
        console.log('=====================================')

        const opcao = await terminal.question('\nDigite a opção desejada: ')

        switch (opcao.trim()) {
            case '1': {
                console.log("\n--- Cadastrar Exemplar ---")
                const titulo = await terminal.question("Digite o título do livro para associar o exemplar: ")
                const busca = await controllerBuscarLivroPorTitulo(titulo);

                if (!busca.sucesso || busca.dados.length === 0) {
                    console.log("\n Livro não encontrado.")
                } else {
                    console.log("\nLivros encontrados:")
                    for (const l of busca.dados) {
                        console.log(`${l.id} | ${l.titulo} | ${l.isbn}`)
                    }
                    const idLivro = await terminal.question("\nDigite o ID do livro escolhido: ")
                    const resposta = await controllerCriarExemplar(idLivro)
                    console.log(`\n ${resposta.mensagem}`)
                }
                break;
            }

            case '2': {
                const id = await terminal.question("Digite o ID do exemplar: ")
                console.log("Status disponíveis: Disponivel, Emprestado, Manutencao, Extraviado")
                const status = await terminal.question("Digite o novo status: ")
                
                const resposta = await controllerAtualizarStatusExemplar(id, status);
                console.log(`\n ${resposta.mensagem}`)
                break;
            }

            case '3': {
                const id = await terminal.question("Digite o ID do exemplar a ser excluído: ")
                const resposta = await controllerDeletarExemplar(id);
                console.log(`\n ${resposta.mensagem}`)
                break;
            }

            case '0':
                rodando = false;
                break;

            default:
                console.log("\n Opção inválida!");
        }
    }
}
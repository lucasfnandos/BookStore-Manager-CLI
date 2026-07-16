import {
    controllerCriarAutor,
    controllerAtualizarAutor,
    controllerBuscarAutorPorNome,
    controllerDeletarAutor
} from "../controllers/Autores"
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
            case '1':
                console.log("\n--- Cadastrar um Autor ---")
                const nomeAutor = await terminal.question("Digite o nome: ")
                const nacAutor = await terminal.question("Digite a nacionalidade: ")
                const dataAutor = await terminal.question("Digite a data de nascimento (DD/MM/AAAA): ")

                const respostaCriar = await controllerCriarAutor(nomeAutor, nacAutor, dataAutor)
                if (respostaCriar.sucesso) {
                    const autor = respostaCriar.dados
                    const anoAtual = new Date().getFullYear()
                    const anoNascimento = autor.data_nascimento.getFullYear()
                    const idadeAutor = anoAtual - anoNascimento

                    console.log(`\n ${respostaCriar.mensagem}`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | Nacionalidade | Data de Nascimento | Idade");
                    console.log(`${autor.id} | ${autor.nome} | ${autor.nacionalidade} | ${dataAutor} | ${idadeAutor} anos`)
                    console.log("-------------------------------------------------------------------------")
                } else {
                    console.log(`\n ${respostaCriar.mensagem}`)
                }
                break

            case '2':
                console.log("\n(Funcionalidade de Edição em construção...)")

                break

            case '3':
                console.log("\n(Funcionalidade de Exclusão em construção...)")
                break

            case '4':
                console.log("\n(Funcionalidade de Busca em construção...)")
                break

            case '0':
                console.log("\nVoltando ao Menu Principal...")
                rodando = false
                break

            default:
                console.log("\n Opção inválida! Tente novamente.")
                break
        }
    }
}
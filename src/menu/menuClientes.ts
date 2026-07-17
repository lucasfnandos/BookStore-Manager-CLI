import {
    controllerCriarCliente,
    controllerAtualizarCliente,
    controllerBuscarClientePorNome,
    controllerDeletarCliente
} from "../controllers/Clientes"
import { formatarDataPtBR } from "../utils/formatters"
import * as readline from 'readline/promises'


export async function iniciarMenuClientes(terminal: readline.Interface): Promise<void> {
    let rodando = true;
    while (rodando) {
        console.log('\n========== MENU CLIENTES ==========')
        console.log('  1. CADASTRAR UM CLIENTE')
        console.log('  2. EDITAR UM CLIENTE')
        console.log('  3. EXCLUIR UM CLIENTE')
        console.log('  4. PESQUISAR UM CLIENTE')
        console.log('  0. VOLTAR AO MENU PRINCIPAL')
        console.log('==================================')

        const opcao = await terminal.question('\nDigite a opção desejada: ')
        switch (opcao.trim()) {
            case '1': {
                console.log("\n--- Cadastrar um Cliente ---")
                const nomeCliente = await terminal.question("Digite o nome: ")
                const cpfCliente = await terminal.question("Digite o cpf (sem pontos nem traço): ")
                const emailCliente = await terminal.question("Digite o email: ")
                const contatoCliente = await terminal.question("Digite o contato (DD+Número sem espaços nem traço): ")
                const dataCliente = await terminal.question("Digite a data de nascimento (DD/MM/AAAA): ")

                const respostaCriar = await controllerCriarCliente(nomeCliente, cpfCliente, emailCliente, contatoCliente, dataCliente)
                if (!respostaCriar.sucesso) {
                    console.log(`\n ${respostaCriar.mensagem}`)
                } else {
                    const cliente = respostaCriar.dados
                    const anoAtual = new Date().getFullYear()
                    const anoNascimento = cliente.data_nascimento.getFullYear()
                    const idadeCliente = anoAtual - anoNascimento

                    console.log(`\n ${respostaCriar.mensagem}`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | CPF | Email | Contato | Data de Nascimento | Idade");
                    console.log(`${cliente.id} | ${cliente.nome} | ${cliente.cpf} | ${cliente.email} | ${cliente.contato} | ${formatarDataPtBR(cliente.data_nascimento)} | ${idadeCliente} anos`)
                    console.log("-------------------------------------------------------------------------")
                }
                break
            }
            case '2': {
                console.log("\n--- Busque o Cliente a ser editado para identificar seu ID: ---")
                const buscarCliente = await terminal.question("Digite o nome do Cliente: ")
                const listarClientes = await controllerBuscarClientePorNome(buscarCliente)
                if(!listarClientes.sucesso) {
                    console.log(`\n ${listarClientes.mensagem}`)
                } else {
                    console.log(`\n ${listarClientes.mensagem}`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | CPF | Email | Contato | Data de Nascimento")
                    const listaDeClientes = listarClientes.dados
                    
                    for(let cliente of listaDeClientes) {
                        console.log(`${cliente.id} | ${cliente.nome} | ${cliente.cpf} | ${cliente.email} | ${cliente.contato} | ${formatarDataPtBR(cliente.data_nascimento)}`)
                    }
                    console.log("-------------------------------------------------------------------------")
                    
                    const idCliente = await terminal.question("Digite o número do ID do Cliente a ser editado: ")
                    const nomeEditado = await terminal.question("Digite o nome do Cliente a ser editado (ou Enter para manter o mesmo): ")
                    const cpfEditado = await terminal.question("Digite o CPF do Cliente para ser editado (ou Enter para manter o mesmo): ")
                    const emailEditado = await terminal.question("Digite o email do Cliente para ser editado (ou Enter para manter o mesmo): ")
                    const contatoEditado = await terminal.question("Digite o contato do Cliente para ser editado (ou Enter para manter o mesmo): ")
                    const dataNasEditado = await terminal.question("Digite a data de nascimento (DD/MM/AAAA) do Cliente a ser editado (ou Enter para manter a mesma) ")
                    const respostaEditar = await controllerAtualizarCliente(idCliente, nomeEditado, cpfEditado, emailEditado, contatoEditado, dataNasEditado)
                    
                    if(!respostaEditar.sucesso) {
                        console.log(`\n ${respostaEditar.mensagem}`)
                    } else {
                        console.log(`\n ${respostaEditar.mensagem}`)
                        const cliente = respostaEditar.dados
                        console.log("ID | Nome | CPF | Email | Contato | Data de Nascimento");
                        console.log(`${cliente.id} | ${cliente.nome} | ${cliente.cpf} | ${cliente.email} | ${cliente.contato} | ${formatarDataPtBR(cliente.data_nascimento)}`)
                    }
                }
                break
            }
            case '3': {
                console.log("\n--- Busque o Cliente a ser excluido para identificar seu ID: ---")
                const buscarCliente = await terminal.question("Digite o nome do Cliente: ")
                const listarClientes = await controllerBuscarClientePorNome(buscarCliente)
                if(!listarClientes.sucesso) {
                    console.log(`\n ${listarClientes.mensagem}`)
                } else {
                    console.log(`\n ${listarClientes.mensagem}`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | CPF | Email | Contato | Data de Nascimento")
                    const listaDeClientes= listarClientes.dados
                    
                    for(let cliente of listaDeClientes) {
                        console.log(`${cliente.id} | ${cliente.nome} | ${cliente.cpf} | ${cliente.email} | ${cliente.contato} | ${formatarDataPtBR(cliente.data_nascimento)}`)

                    }
                    console.log("-------------------------------------------------------------------------")
                    
                    const idCliente = await terminal.question("Digite o número do ID do Cliente a ser excluido: ")
                    const respostaDeletar = await controllerDeletarCliente(idCliente)
                    console.log(`\n ${respostaDeletar.mensagem}`)
                }
                break
            }
            case '4': {
                console.log("\n--- Listar Clientes por nome: ---")
                const buscarCliente = await terminal.question("Digite o nome do Cliente: ")
                const listarClientes = await controllerBuscarClientePorNome(buscarCliente)
                if(!listarClientes.sucesso) {
                    console.log(`\n ${listarClientes.mensagem}`)
                } else {
                    console.log(`\n ${listarClientes.mensagem}`)
                    console.log("-------------------------------------------------------------------------")
                    console.log("ID | Nome | CPF | Email | Contato | Data de Nascimento")
                    const listaDeClientes = listarClientes.dados
                    
                    for(let cliente of listaDeClientes) {
                        console.log(`${cliente.id} | ${cliente.nome} | ${cliente.cpf} | ${cliente.email} | ${cliente.contato} | ${formatarDataPtBR(cliente.data_nascimento)}`)

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
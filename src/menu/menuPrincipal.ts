import * as readline from 'readline/promises'
import { iniciarMenuAutores } from './menuAutores'
import { iniciarMenuClientes } from './menuClientes'
import { iniciarMenuEmprestimos } from './menuEmprestimos'
import { iniciarMenuRelatorios } from './menuRelatorios'
import { iniciarMenuLivros } from './menuLivros'
import { iniciarMenuExemplares } from './menuExemplares'

export async function iniciarMenuPrincipal(terminal: readline.Interface): Promise<void> {
    let rodando = true
    while (rodando) {
        console.log('\n=======================================');
        console.log('       BOOKSTORE MANAGER CLI       ');
        console.log('=======================================');
        console.log('  1. GESTÃO DE AUTORES');
        console.log('  2. GESTÃO DE CLIENTES');
        console.log('  3. GESTÃO DE LIVROS E OBRAS');
        console.log('  4. GESTÃO DE EXEMPLARES');
        console.log('  5. GESTÃO DE EMPRÉSTIMOS E DEVOLUÇÕES');
        console.log('  6. RELATÓRIOS DO SISTEMA');
        console.log('  0. SAIR DO SISTEMA');
        console.log('=======================================');

        const opcao = await terminal.question('\nEscolha um módulo para acessar: ')
        switch (opcao.trim()) {
            case '1':
                await iniciarMenuAutores(terminal)
                break;
            case '2':
                await iniciarMenuClientes(terminal)
                break
            case '3':
                await iniciarMenuLivros(terminal)
                break
            case '4':
                await iniciarMenuExemplares(terminal)
                break
            case '5':
                await iniciarMenuEmprestimos(terminal)
                break
            case '6':
                await iniciarMenuRelatorios(terminal)
                break
            case '0':
                console.log('\n...Encerrando o sistema.')
                rodando = false
                break
            default:
                console.log('\nErro: Opção inválida! Tente novamente.')
                break
        }
    }
}
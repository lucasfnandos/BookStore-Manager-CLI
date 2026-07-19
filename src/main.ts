import * as readline from 'readline/promises'
import { stdin as input, stdout as output } from 'process'
import { iniciarMenuPrincipal } from './menu/menuPrincipal'
import { pool } from './database/db'

async function main() {
    const terminal = readline.createInterface({ input, output });
    try {
        console.log("Iniciando o sistema...");
        await iniciarMenuPrincipal(terminal);
        
    } catch (error) {
        console.error("\nOcorreu um erro fatal na aplicação:", error);
    } finally {
        terminal.close();
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
        process.exit(0);
    }
}

main();
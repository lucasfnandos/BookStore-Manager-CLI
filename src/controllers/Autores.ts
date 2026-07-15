import {
    serviceCriarAutor,
    serviceAtualizarAutor,
    serviceBuscarAutorPorNome,
    serviceDeletarAutor
} from "../services/Autores"

export async function controllerCriarAutor(nome:string, nacionalidade:string, data_nascimento:Date):Promise<object> {
    try {
        //SANITIZAR OS DADOS PRIMEIRA LETRA DA PALAVRA MAIUSCULA DEMAIS MINUSCULA SEM ESPAÇOS EM BRANCO NO FINAL E INICIO .TRIM()
        //APOS SANITIZAR SEGUE:
        //VALIDAR OS DADOS DE ENTRADA VAZIO OU NUMEROS ONDE DEVERIA SER LETRAS VERIFICAR QUANTIDADE DE CARACTERES
        //IF(DADOS OK) SEGUE:
        const criarAutor = await serviceCriarAutor(nome, nacionalidade, data_nascimento)
        return { sucesso: true, mensagem: "Sucesso!", dados: criarAutor }
    } catch(err: any) {
        const mensagemAmigavel = traduzirErro(err, 'Autor')
        return { sucesso: false, mensagem: mensagemAmigavel}
    }
}
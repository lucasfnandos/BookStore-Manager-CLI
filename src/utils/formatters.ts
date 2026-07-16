export function formatarDataPtBR(data: Date | string): string {
    if (!data) return "Data não informada";

    const d = new Date(data);

    // Se a data for inválida, retorna um aviso em vez de "NaN/NaN/NaN"
    if (isNaN(d.getTime())) return "Data inválida";

    // getUTCDate() pega o dia exato ignorando o fuso horário do computador
    // padStart(2, '0') garante que o dia 5 vire "05"
    const dia = String(d.getUTCDate()).padStart(2, '0');
    
    // getUTCMonth() começa do 0 (Janeiro = 0), por isso somamos 1
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
    
    const ano = d.getUTCFullYear();

    return `${dia}/${mes}/${ano}`;
}
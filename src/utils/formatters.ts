export function formatarDataPtBR(data: Date | string): string {
    if (!data) return "Data não informada"

    const d = new Date(data);

    if (isNaN(d.getTime())) return "Data inválida"

    const dia = String(d.getUTCDate()).padStart(2, '0')
    
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0')
    
    const ano = d.getUTCFullYear()

    return `${dia}/${mes}/${ano}`
}
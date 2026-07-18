export function ehEmailValido(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}
export function ehAnoValido(ano: string): boolean {
    const regex = /^\d{4}$/;
    if (!regex.test(ano)) {
        return false;
    }
    const anoNum = parseInt(ano, 10);
    const anoAtual = new Date().getFullYear();
    if (anoNum > anoAtual || anoNum < 1000) {
        return false;
    }
    return true;
}

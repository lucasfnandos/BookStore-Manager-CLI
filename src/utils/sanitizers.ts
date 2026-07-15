
export function limparTexto(texto?: string): string {
    if (!texto) return "";
    return texto.trim().replace(/\s+/g, ' ');
}

export function capitalizarNome(nome?: string): string {
    if (!nome) return "";
    
    const textoLimpo = limparTexto(nome);
    const preposicoes = ["de", "da", "do", "das", "dos", "e"];
    
    return textoLimpo
        .toLowerCase()
        .split(' ')
        .map(palavra => {
            if (preposicoes.includes(palavra)) {
                return palavra;
            }
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        })
        .join(' ');
}

export function apenasNumeros(valor?: string): string {
    if (!valor) return "";
    return valor.replace(/\D/g, '');
}

export function limparEmail(email?: string): string {
    if (!email) return "";
    return email.trim().toLowerCase();
}

export function limparISBN(isbn?: string): string {
    if (!isbn) return "";
    // Remove hifens e espaços em branco, força maiúscula caso tenha o 'X' do ISBN-10
    return isbn.replace(/[-\s]/g, '').toUpperCase();
}

export function limparData(dataStr?: string): string {
    if (!dataStr) return "";
    
    let dataLimpa = dataStr.trim();

    const regexBR = /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/;
    const match = dataLimpa.match(regexBR);
    
    if (match) {
        return `${match[3]}-${match[2]}-${match[1]}`;
    }

    return dataLimpa;
}
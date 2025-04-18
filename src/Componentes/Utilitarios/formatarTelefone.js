export const formatarTelefoneParaCallMeBot = (telefoneBr) => {
    const apenasNumeros = telefoneBr.replace(/\D/g, "");
  
    if (apenasNumeros.startsWith("55") && apenasNumeros.length === 13) {
      return apenasNumeros;
    }
  
    if (apenasNumeros.length === 11) {
      return `55${apenasNumeros}`;
    }
  
    return null; // Telefone inválido
  };
  

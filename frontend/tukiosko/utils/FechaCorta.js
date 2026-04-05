/**
 * Formatea una fecha ISO a un formato corto: "Día Mes"
 * Ejemplo: "2026-03-25T..." -> "25 mar" o "25 marzo"
 */
export const fechaCorta = (fechaStr) => {
    if (!fechaStr) return "";
    
    const fecha = new Date(fechaStr);
    
    // Si quieres el mes abreviado (ene, feb, mar...) usa month: 'short'
    // Si lo quieres completo (enero, febrero...) usa month: 'long'
    return fecha.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
    }); 
};

export const fechaDetallada = (fechaStr) => {
    if (!fechaStr) return "";

    const fecha = new Date(fechaStr);

    // Configuramos el formato de fecha y hora
    const opcionesFecha = { day: 'numeric', month: 'long' };
    const opcionesHora = { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    };

    const parteFecha = fecha.toLocaleDateString('es-ES', opcionesFecha);
    const parteHora = fecha.toLocaleTimeString('es-ES', opcionesHora)
        .toLowerCase()
        .replace(/\s+/g, ''); // Quitamos espacios para que quede "9:25pm"

    return `${parteFecha}, ${parteHora}`;
};


// export default fechaCorta;

// --- Ejemplos de uso ---
// const fechaISO = "2026-03-25T01:24:56.333683Z";
// console.log(fechaFinal(fechaISO)); // Salida: "25 mar"
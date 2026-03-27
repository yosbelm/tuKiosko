const fechaISO = "2026-03-25T01:24:56.333683Z";
const objetoFecha = new Date(fechaISO);

// A. Solo el día de la semana (ej: "miércoles")
const diaSemana = objetoFecha.toLocaleDateString('es-ES', { weekday: 'long' });

// B. Solo la hora y minutos (ej: "01:24")
const horaSolo = objetoFecha.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
});

// C. Fecha completa legible (ej: "miércoles, 25 de marzo")
const fechaCorta = objetoFecha.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
});

const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const fechaFinal = (fechaStr) =>{
    const fecha = new Date(fechaStr);
    const fechaCorta = fecha.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
    }); 
    const horaSolo = fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
    return `${fechaCorta}, ${horaSolo}`
}

export default fechaFinal;

console.log(diaSemana); // miércoles
console.log(horaSolo);  // 01:24
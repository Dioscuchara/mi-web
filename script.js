const buscador = document.getElementById('buscador');
const tarjetas = document.querySelectorAll('.tarjeta');
const secciones = document.querySelectorAll('.seccion-catalogo');
const mensajeVacio = document.getElementById('mensaje-vacio');

function limpiarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function ejecutarFiltro(valorBusqueda, esCategoria = false) {
    const textoUsuario = limpiarTexto(valorBusqueda);

    if (textoUsuario === "") {
        tarjetas.forEach(tarjeta => tarjeta.style.display = "");
        secciones.forEach(seccion => {
            seccion.style.display = "";
            if (seccion.previousElementSibling && seccion.previousElementSibling.tagName === 'H2') {
                seccion.previousElementSibling.style.display = "";
            }
        });
        mensajeVacio.style.display = 'none';
        return;
    }

    const palabrasBuscadas = textoUsuario.split(/\s+/);
    let totalTarjetasVisibles = 0;

    tarjetas.forEach(function(tarjeta) {
        const textoCategoria = limpiarTexto(tarjeta.querySelector('.categoria').textContent);
        const titulo = tarjeta.querySelector('h3').textContent;
        const descripcion = tarjeta.querySelector('p').textContent;
        
        let coincideTodo = false;

        if (esCategoria) {
            coincideTodo = palabrasBuscadas.every(function(palabraBuscada) {
                const expresionRegular = new RegExp('\\b' + palabraBuscada + '\\b', 'i');
                return expresionRegular.test(textoCategoria);
            });
        } else {
            const textoTarjetaLimpio = limpiarTexto(textoCategoria + " " + titulo + " " + descripcion);
            coincideTodo = palabrasBuscadas.every(function(palabraBuscada) {
                const expresionRegular = new RegExp('\\b' + palabraBuscada, 'i');
                return expresionRegular.test(textoTarjetaLimpio);
            });
        }

        if (coincideTodo) {
            tarjeta.style.display = "";
            totalTarjetasVisibles++;
        } else {
            tarjeta.style.display = 'none';
        }
    });

    secciones.forEach(function(seccion) {
        const tarjetasVisiblesEnSeccion = Array.from(seccion.querySelectorAll('.tarjeta')).filter(t => t.style.display !== 'none').length;
        const tituloAsociado = seccion.previousElementSibling;

        if (tarjetasVisiblesEnSeccion === 0) {
            seccion.style.display = 'none';
            if (tituloAsociado && tituloAsociado.tagName === 'H2') {
                tituloAsociado.style.display = 'none';
            }
        } else {
            seccion.style.display = "";
            if (tituloAsociado && tituloAsociado.tagName === 'H2') {
                tituloAsociado.style.display = "";
            }
        }
    });

    if (totalTarjetasVisibles === 0) {
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
    }
}

buscador.addEventListener('keyup', function(evento) {
    ejecutarFiltro(evento.target.value, false);
});

const botonesCategoria = document.querySelectorAll('.categoria');
botonesCategoria.forEach(function(boton) {
    boton.addEventListener('click', function() {
        const textoCategoria = boton.textContent;
        buscador.value = textoCategoria;
        ejecutarFiltro(textoCategoria, true);
        buscador.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});
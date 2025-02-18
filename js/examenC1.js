document.addEventListener("DOMContentLoaded", function () {
    const selectLibro = document.getElementById("selectLibro");
    const mensaje = document.getElementById("mensaje");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnLimpiar = document.getElementById("limpiar");
    const tbody = document.getElementById("tbody");

    btnBuscar.addEventListener("click", buscarLibro);
    btnLimpiar.addEventListener("click", limpiar);

    cargarLibros();

    async function cargarLibros() {
        const url = "https://openlibrary.org/search.json?author=Stephen+King";
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error en la respuesta de la API");
            const data = await response.json();

            if (!data || !Array.isArray(data.docs)) {
                throw new Error("La API no devuelve una lista de libros válida.");
            }

            selectLibro.innerHTML = "<option value=''>Seleccione un libro</option>";

            data.docs.forEach((libro, index) => {
                if (libro.title && libro.key) {
                    let option = document.createElement("option");
                    option.value = libro.key;
                    option.textContent = libro.title;
                    option.dataset.index = index + 1;
                    selectLibro.appendChild(option);
                }
            });
        } catch (error) {
            mensaje.textContent = "Error al cargar los libros: " + error.message;
        }
    }

    async function buscarLibro() {
        let libroKey = selectLibro?.value;
        if (!libroKey) {
            mensaje.textContent = "Por favor, seleccione un libro.";
            return;
        }
        let libroId = selectLibro.options[selectLibro.selectedIndex].dataset.index;
        const detalleUrl = `https://openlibrary.org${libroKey}.json`;
        try {
            const response = await fetch(detalleUrl);
            if (!response.ok) throw new Error("Error al obtener los detalles del libro");
            const detallesLibro = await response.json();
            const titulo = detallesLibro.title;
            //solucion para encontar las paginas y la editorial
            const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(titulo)}&inauthor=Stephen+King`;

            const googleResponse = await fetch(googleBooksUrl);
            const googleData = await googleResponse.json();
            let numeroPaginas = "N/A";
            let editoriales = "No disponible";
            if (googleData.totalItems > 0) {
                const libroGoogle = googleData.items[0].volumeInfo;
                numeroPaginas = libroGoogle.pageCount || numeroPaginas;
                editoriales = libroGoogle.publisher || editoriales;
            }

            mostrarLibro(libroId, detallesLibro, numeroPaginas, editoriales);
        } catch (error) {
            mensaje.textContent = "Error al obtener los detalles del libro: " + error.message;
        }
    }

    function mostrarLibro(libroId, libro, numeroPaginas, editoriales) {
        limpiar();
        const fila = document.createElement("tr");
        const col1 = document.createElement("td");
        col1.textContent = libroId || "N/A";
        fila.appendChild(col1);

        const col2 = document.createElement("td");
        col2.textContent = libro.title || "No disponible";
        fila.appendChild(col2);

        const col3 = document.createElement("td");
        col3.textContent = libro.first_publish_date?.split("-")[0] || "Desconocido";
        fila.appendChild(col3);

        const col4 = document.createElement("td");
        col4.textContent = numeroPaginas;
        fila.appendChild(col4);

        const col5 = document.createElement("td");
        col5.textContent = editoriales;
        fila.appendChild(col5);

        tbody?.appendChild(fila);
    }

    function limpiar() {
        if (tbody) tbody.innerHTML = "";
        if (mensaje) mensaje.textContent = "";
    }
});

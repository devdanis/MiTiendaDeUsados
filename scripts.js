document.addEventListener("DOMContentLoaded", function () {
	let products = [];
	let filtersApplied = false; // Variable para rastrear si se han aplicado filtros

	fetch("products.json")
		.then((response) => response.json())
		.then((data) => {
			products = data;
			displayProducts(products);
		})
		.catch((error) => console.error("Error loading products:", error));

	const filtersForm = document.getElementById("filters");
	const filterName = document.getElementById("filter-name");
	const filterPriceMin = document.getElementById("filter-price-min");
	const filterPriceMax = document.getElementById("filter-price-max");
	const sortPrice = document.getElementById("sort-price");
	const applyFiltersButton = document.getElementById("apply-filters");
	const clearFiltersButton = document.getElementById("clear-filters");

	// Función para aplicar los filtros
	function applyFilters() {
		let filteredProducts = products;

		// Obtener valores de los filtros
		const name = filterName.value.toLowerCase();
		const minPrice = parseFloat(filterPriceMin.value);
		const maxPrice = parseFloat(filterPriceMax.value);
		const sortOrder = sortPrice.value;

		// Filtrar productos
		filteredProducts = filteredProducts.filter((product) => {
			// Verificar si hay coincidencias en alguna propiedad del producto
			return Object.values(product).some((value) => {
				if (typeof value === "string" && value.toLowerCase().includes(name)) {
					return true; // Si se encuentra una coincidencia, devolver verdadero
				}
				if (typeof value === "number" && !isNaN(minPrice) && !isNaN(maxPrice)) {
					return value >= minPrice && value <= maxPrice; // Filtrar por rango de precio
				}
				return false; // Si no hay coincidencia, devolver falso
			});
		});

		// Ordenar productos si se especifica
		if (sortOrder === "asc") {
			filteredProducts.sort((a, b) => a.price - b.price);
		} else if (sortOrder === "desc") {
			filteredProducts.sort((a, b) => b.price - a.price);
		}

		// Actualizar estado de filtros aplicados
		filtersApplied =
			name || !isNaN(minPrice) || !isNaN(maxPrice) || sortOrder !== "none";

		displayProducts(filteredProducts);
	}

	// Aplicar filtros cuando se presiona "Enter" en los campos de filtro
	filterName.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault(); // Evitar envío del formulario
			applyFilters(); // Aplicar filtros
		}
	});

	filterPriceMin.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault(); // Evitar envío del formulario
			applyFilters(); // Aplicar filtros
		}
	});

	filterPriceMax.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault(); // Evitar envío del formulario
			applyFilters(); // Aplicar filtros
		}
	});

	sortPrice.addEventListener("change", function (event) {
		applyFilters(); // Aplicar filtros al cambiar la opción de orden
	});

	applyFiltersButton.addEventListener("click", applyFilters); // Aplicar filtros al hacer clic en el botón

	clearFiltersButton.addEventListener("click", () => {
		filterName.value = "";
		filterPriceMin.value = "";
		filterPriceMax.value = "";
		sortPrice.value = "none";
		filtersApplied = false; // Restablecer estado de filtros aplicados
		displayProducts(products);
	});

	function displayProducts(products) {
		const productList = document.getElementById("product-list");
		productList.innerHTML = "";

		products.forEach((product) => {
			const productElement = document.createElement("div");
			productElement.classList.add("product");

			const imageElements = product.images
				.map((image) => `<div><img src="${image}" alt="${product.name}"></div>`)
				.join("");

			productElement.innerHTML = `
                <div class="carousel">${imageElements}</div>
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span>$${product.price}</span>
                </div>
            `;

			productList.appendChild(productElement);
		});

		// Inicializar slick carousel
		$(".carousel").slick({
			dots: true,
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			adaptiveHeight: true,
			arrows: true,
		});

		// Actualizar color de fondo del botón Limpiar Filtros
		clearFiltersButton.style.backgroundColor = filtersApplied
			? "#6200ea"
			: "#ccc";
	}
});

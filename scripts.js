let globalPriceRanges;

document.addEventListener("DOMContentLoaded", function () {
	let products = [];
	// let filtersApplied = false; // Variable para rastrear si se han aplicado filtros
	let nameFilterApplied = false;
	let priceFilterApplied = false;
	let rangeFilterApplied = false;

	fetch("products.json")
		.then((response) => response.json())
		.then((data) => {
			products = data;

			// Calcula los rangos de precios y guárdalos en una variable global
			globalPriceRanges = calculatePriceRanges(products);

			// Crea los botones de rango de precios
			createRangeButtons();

			displayProducts(products);
		})
		.catch((error) => console.error("Error loading products:", error));

	// Función para calcular los rangos de precios
	function calculatePriceRanges(products) {
		let prices = products.map((product) => product.price);
		prices.sort((a, b) => a - b);

		let quartile1 = prices[Math.floor(prices.length * 0.25)];
		let quartile2 = prices[Math.floor(prices.length * 0.5)];
		let quartile3 = prices[Math.floor(prices.length * 0.75)];
		let quartile4 = prices[prices.length - 1];

		return [
			{ min: prices[0], max: quartile1 },
			{ min: quartile1 + 1, max: quartile2 },
			{ min: quartile2 + 1, max: quartile3 },
			{ min: quartile3 + 1, max: quartile4 },
		];
	}

	$(function () {
		$("#price-range").slider({
			range: true,
			min: 0,
			max: 1000000,
			values: [0, 1000000],
			slide: function (event, ui) {
				$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
				filterPriceMin.value = ui.values[0];
				filterPriceMax.value = ui.values[1];
				applyFilters();
			},
		});
		$("#amount").val(
			"$" +
				$("#price-range").slider("values", 0) +
				" - $" +
				$("#price-range").slider("values", 1)
		);
	});

	const filtersForm = document.getElementById("filters");
	const filterName = document.getElementById("filter-name");
	const filterPriceMin = document.getElementById("filter-price-min");
	const filterPriceMax = document.getElementById("filter-price-max");
	const sortPrice = document.getElementById("sort-price");
	const applyFiltersButton = document.getElementById("apply-filters");
	const clearFiltersButton = document.getElementById("clear-filters");
	clearFiltersButton.addEventListener("click", clearFilters);
	document
		.getElementById("toggleAside")
		.addEventListener("click", function (e) {
			let aside = document.querySelector("aside");
			aside.classList.toggle("open");
		});

	document.addEventListener("click", function (e) {
		let aside = document.querySelector("aside");
		let toggle = document.getElementById("toggleAside");

		if (!aside.contains(e.target) && !toggle.contains(e.target)) {
			aside.classList.remove("open");
		}
	});

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
			// Filtrar por nombre en nombre y descripción
			if (
				name &&
				!(
					product.name.toLowerCase().includes(name) ||
					product.description.toLowerCase().includes(name)
				)
			)
				return false;

			// Filtrar por rango de precios
			if (!isNaN(minPrice) && product.price < minPrice) return false;
			if (!isNaN(maxPrice) && product.price > maxPrice) return false;

			return true;
		});

		// Ordenar productos si se especifica
		if (sortOrder === "asc") {
			filteredProducts.sort((a, b) => a.price - b.price);
		} else if (sortOrder === "desc") {
			filteredProducts.sort((a, b) => b.price - a.price);
		}

		// Actualizar estado de filtros aplicados
		nameFilterApplied = name;
		priceFilterApplied = !isNaN(minPrice) || !isNaN(maxPrice);
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

	function clearFilters() {
		console.log("clearFilters was called");
		filterName.value = "";
		filterPriceMin.value = "";
		filterPriceMax.value = "";
		sortPrice.value = "none";
		nameFilterApplied = false;
		priceFilterApplied = false;
		rangeFilterApplied = false;
		rangeFilterApplied = false;
		displayProducts(products);
	}

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
			clearFiltersButton.style.backgroundColor =
				nameFilterApplied || priceFilterApplied || rangeFilterApplied
					? "#6200ea"
					: "#ccc";
		});

		// Inicializar slick carousel
		$(".carousel").slick({
			dots: true,
			infinite: true,
			speed: 300,
			fade: true,
			cssEase: "linear",
			slidesToShow: 1,
			slidesToScroll: 1,
			adaptiveHeight: true,
			arrows: true,
			prevArrow: '<button type="button" class="slick-prev">Previous</button>',
			nextArrow: '<button type="button" class="slick-next">Next</button>',
		});
	}
	$(window).on("keydown", function (e) {
		switch (e.which) {
			case 37: // left
				$(".carousel").slick("slickPrev");
				break;
			case 39: // right
				$(".carousel").slick("slickNext");
				break;
		}
	});
	function applyRangeFilter(rangeIndex) {
		if (globalPriceRanges) {
			// Deshabilita el slider
			$("#price-range").slider("option", "disabled", true);

			// Actualiza los valores de los campos de entrada de precio
			document.getElementById("filter-price-min").value =
				globalPriceRanges[rangeIndex].min;
			document.getElementById("filter-price-max").value =
				globalPriceRanges[rangeIndex].max;

			rangeFilterApplied = true;

			// Habilita el slider nuevamente
			$("#price-range").slider("option", "disabled", false);

			// Forza la ejecución de applyFilters para reflejar los cambios
			displayProducts(filteredProducts);
		} else {
			console.log("globalPriceRanges is not defined.");
		}
	}
	// Crea los botones de rango de precios
	function createRangeButtons() {
		if (globalPriceRanges) {
			let rangeButtons = "";
			for (let i = 0; i < globalPriceRanges.length; i++) {
				rangeButtons += `<button onclick="applyRangeFilter(${i})">`;
				rangeButtons += `${globalPriceRanges[i].min} - ${globalPriceRanges[i].max}</button>`;
			}
			document.getElementById("rangeFilter").innerHTML = rangeButtons;
		} else {
			console.log("globalPriceRanges is not defined.");
		}
	}
});

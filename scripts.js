document.addEventListener("DOMContentLoaded", function () {
	fetch("products.json")
		.then((response) => response.json())
		.then((products) => {
			const productList = document.getElementById("product-list");
			products.forEach((product) => {
				const productElement = document.createElement("div");
				productElement.classList.add("product");

				const imageElements = product.images
					.map(
						(image) => `<div><img src="${image}" alt="${product.name}"></div>`
					)
					.join("");

				productElement.innerHTML = `
                    <div class="carousel">${imageElements}</div>
                    <div class="product-content">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>${product.ubicacion}</p>
                        <p>${product.contacto}</p>
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
			});
		})
		.catch((error) => console.error("Error loading products:", error));
});


const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        image: "https://placehold.co/300x200?text=Headphones"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1999,
        image: "https://placehold.co/300x200?text=Smart+Watch"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 2499,
        image: "https://placehold.co/300x200?text=Shoes"
    },
    {
        id: 4,
        name: "Backpack",
        price: 999,
        image: "https://placehold.co/300x200?text=Backpack"
    }
];

const productList = document.getElementById("product-list");

if (productList) {
    productList.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;

        productList.appendChild(card);
    });
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = products.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");
}
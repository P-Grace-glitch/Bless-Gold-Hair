let label = document.getElementById('label');
let Shoppingcart = document.getElementById('shopping-cart');
let basket = JSON.parse(localStorage.getItem("Data")) || [];
let productsData = [];

const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products');
    productsData = await response.json();
    generateCartItems();
    TotalAmount();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

fetchProducts();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (Shoppingcart.innerHTML = basket.map((x) => {
      let { name, item } = x;
      let search = productsData.find((y) => y.name === name) || [];
      return `
        <div class="cart-item">
          <img width="120" src="/uploads/${search.image}" alt="" />
          <div class="details">
            <div class="title-price-x">
              <h4 class="title-price">
                <p>${search.name}</p>
                <p class="cart-item-price"><span>&#8358;</span>${search.price}</p>
              </h4>
              <i onclick="removeItem('${name}')" class='bx bx-x' ></i>
            </div>
            <div class="button">
              <i onclick="decrement('${name}')" class='bx bx-minus'></i>
              <div id=${name} class="quantity">${item}</div>
              <i onclick="increment('${name}')" class='bx bx-plus'></i>
            </div>
            <h3><span>&#8358;</span>${item * search.price}</h3>
          </div>
        </div>
      `;
    }).join(""));
  } else {
    Shoppingcart.innerHTML = ''
    label.innerHTML = `
      <h2>Cart is Empty</h2>
      <a href="shopcart.html">
        <button class="HomeBtn">Back to Shop</button>
      </a>
    `;
  }
};

let increment = (name) => {
  let selectedItem = name;
  let search = basket.find((x) => x.name === selectedItem);
  if (search === undefined) {
    basket.push({
      name: selectedItem,
      item: 1,
    })
  } else {
    search.item += 1;
  }
  update(selectedItem);
  generateCartItems();
  localStorage.setItem("Data", JSON.stringify(basket));
};

let decrement = (name) => {
  let selectedItem = name;
  let search = basket.find((x) => x.name === selectedItem);
  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("Data", JSON.stringify(basket));
};

let update = (name) => {
  let search = basket.find((x) => x.name === name);
  let quantityElement = document.getElementById(name);
  if (quantityElement) {
    quantityElement.innerHTML = search.item;
  }
  calculation();
  TotalAmount();
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount")
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0)
}

let removeItem = (name) => {
  let selectedItem = name;
  basket = basket.filter((x) => x.name !== selectedItem);
  generateCartItems();
  TotalAmount();
  calculation();
  localStorage.setItem("Data", JSON.stringify(basket));
};

let clearCart = () => {
  basket = []
  generateCartItems();
  calculation();
  localStorage.setItem("Data", JSON.stringify(basket));
  TotalAmount();
}

let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket.reduce((acc, current) => {
      let search = productsData.find((y) => y.name === current.name) || [];
      return acc + current.item * search.price;
    }, 0);
    let products = basket.map((x) => {
      let { item, name } = x;
      let search = productsData.find((y) => y.name === name) || [];
      return `${search.name} x ${item}`;
    }).join(", ");
    let orderData = {
      totalAmount: amount,
      products: products
    };
    localStorage.setItem("orderData", JSON.stringify(orderData));
    label.innerHTML = `
      <h2>Total Price: <span>&#8358;</span>${amount}</h2>
      <a href="payment.html"><button class="checkout">Check Out</button></a>
      <button onclick="clearCart()" class="removeAll">Clear Cart</button>
      <a href="shopcart.html"><button>Back To Shop</button></a>
    `;
  }
};

window.addEventListener("load", TotalAmount);

function addToCart(item) {
  // ... add item to cart ...
  TotalAmount();
}

function removeFromCart(item) {
  // ... remove item from cart ...
  TotalAmount();
}



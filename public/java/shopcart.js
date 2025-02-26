let shop = document.getElementById("shop")
let shopContainer = document.getElementById("shop")
let basket = JSON.parse(localStorage.getItem("Data")) || [];
const productsData = JSON.parse(localStorage.getItem('products')) || [];

const generateShop = async () => {
  try {
    const response = await fetch('/products');
    const productsData = await response.json();
    console.log('productsData:', productsData);
    const shopContainer = document.getElementById("shop");
    shopContainer.innerHTML = productsData.map((x) => {
      let { name, price, description, image } = x;
      let search = basket.find((x) => x.name === name) || [];
      return `
        <div id="product-id-${name}" class="item">
          <img width="220" src="/uploads/${image}" alt="${name}">
          <div class="details">
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="price-quantity">
              <h2><span>&#8358</span> ${price}</h2>
              <div class="button">
                <i class='bx bx-minus' onclick="decrement('${name}')"></i>
                <div id=${name} class="quantity" data-product-name="${name}"> ${search.item === undefined ? 0 : search.item} </div>
                <i class='bx bx-plus' onclick="increment('${name}')"></i>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

generateShop();

const updateQuantity = () => {
  productsData.forEach((product) => {
    let search = basket.find((x) => x.name === product.name);
    if (search) {
      let quantityElement = document.getElementById(product.name);
      if (quantityElement) {
        quantityElement.innerHTML = search.item;
      }
    }
  });
};

generateShop();
updateQuantity();

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
  generateShop();
  calculation();
  localStorage.setItem("Data", JSON.stringify(basket));
  // Update the product quantity on the product page
  let productQuantityElements = document.querySelectorAll(`[data-product-name="${selectedItem}"]`);
  productQuantityElements.forEach((element) => {
    element.innerHTML = search.item;
  });
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
  generateShop();
  calculation();
  localStorage.setItem("Data", JSON.stringify(basket));
  // Update the product quantity on the product page
  let productQuantityElements = document.querySelectorAll(`[data-product-name="${selectedItem}"]`);
  productQuantityElements.forEach((element) => {
    element.innerHTML = search.item;
  });
};


let update = (name) => {
  let search = basket.find((x) => x.name === name);
  document.getElementById('cartAmount').innerHTML = search.item;
  calculation();
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount")
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0)
}
calculation();

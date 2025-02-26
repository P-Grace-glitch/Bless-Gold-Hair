const form = document.getElementById('product-form');
const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        image: formData.get('image'),
    };
    localStorage.setItem('products', JSON.stringify(productData));
});


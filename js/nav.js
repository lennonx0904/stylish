/* global get  page*/
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
const cartBtn = document.querySelectorAll('.cartBtn');
const numberInCart = document.querySelectorAll('.numberInCart');    

const getLocalStorage = () => {
    if (localStorage.cart == undefined) {
        localStorage.cart = [];
    } 
    if (localStorage.cart == '' || localStorage.cart == '[]') {        
        numberInCart.forEach((e) => e.classList.add('hidden'));
    }  else {
        numberInCart.forEach((e) => e.classList.remove('hidden'));
        numberInCart.forEach((e) => e.innerHTML = JSON.parse(localStorage.cart).length); 
    }
}
getLocalStorage(); 
cartBtn.forEach((item) => {
    item.addEventListener('click', () => {   
        if (localStorage.cart.length <= 0) {
            cartBtn.classList.add('preventClicked');
            alert('您還沒選擇商品');
            return;
        }
    })
});






/* global get  page*/
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
const cartBtn = document.querySelectorAll(".cartBtn");
const numberInCart = document.querySelectorAll(".numberInCart");

const getLocalStorage = () => {
  if (localStorage.cart === undefined) {
    localStorage.cart = [];
  }
  if (localStorage.cart === "" || localStorage.cart === "[]") {
    numberInCart.forEach(e => e.classList.add("hidden"));
  } else {
    numberInCart.forEach(e => {
      e.classList.remove("hidden");
      e.textContent = JSON.parse(localStorage.cart).length;
    });
  }
};
getLocalStorage();


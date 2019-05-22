/* global getLocalStorage */

const dataInCart = JSON.parse(localStorage.getItem("cart"));
const cartTable = document.querySelector(".cartTable");
const qtyInCart = document.querySelector(".qtyInCart");
const totalPrice = document.querySelector(".totalPrice");
const deliveryFee = document.querySelector(".deliveryFee");
const totalCharge = document.querySelector(".totalCharge");
let curDeliveryFee = 100;

const changeQty = () => {
  const cartQtyValue = document.querySelectorAll(".cartQtyValue");
  cartQtyValue.forEach((e, i) => {
    e.addEventListener("change", () => {
      const curQty = cartQtyValue[i].value;
      dataInCart[i].qty = Number(curQty);
      localStorage.cart = JSON.stringify(dataInCart);
      printCart();
    });
  });
};

const deleteRowForWeb = () => {
  const deleteBtnForWeb = document.querySelectorAll(".deleteBtnForWeb");
  deleteBtnForWeb.forEach((e, i) => {
    e.addEventListener("click", () => {
      dataInCart.splice(i, 1);
      localStorage.cart = JSON.stringify(dataInCart);
      printCart();
      getLocalStorage();
    });
  });
};

const deleteRowForMobile = () => {
  const deleteBtnForMobile = document.querySelectorAll(".deleteBtnForMobile");
  deleteBtnForMobile.forEach((e, i) => {
    e.addEventListener("click", () => {
      dataInCart.splice(i, 1);
      localStorage.cart = JSON.stringify(dataInCart);
      printCart();
      getLocalStorage();
    });
  });
};

const createElement = (tagName, className, content, parentNode) => {
  const element = document.createElement(tagName);
  element.setAttribute("class", className);
  element.appendChild(document.createTextNode(content));
  parentNode.appendChild(element);
};

const printCart = () => {
  qtyInCart.textContent = `購物車(${dataInCart.length})`;
  while (cartTable.hasChildNodes()) {
    cartTable.removeChild(cartTable.firstChild);
  }
  // 印出localStorage的值
  dataInCart.forEach(item => {
    // ----------- level 1 -------------
    const flexRowInCart = document.createElement("div");
    flexRowInCart.className = "flexRowInCart flexRow flexWrap";
    cartTable.appendChild(flexRowInCart);

    // ----------- level 2 -------------
    const cartProductContainer = document.createElement("div");
    cartProductContainer.className = "cartProductContainer flex";
    const deleteBtnContainerForMobile = document.createElement("div");
    deleteBtnContainerForMobile.className = "deleteBtnContainer forMobile";
    const deleteBtnForMobile = document.createElement("img");
    deleteBtnForMobile.className = "deleteBtnForMobile";
    deleteBtnForMobile.setAttribute("src", "./images/cart-remove.png");
    const flexItem2 = document.createElement("div");
    flexItem2.className = "flexItem2 flex row-aling-item row-space-between";

    flexRowInCart.appendChild(cartProductContainer);
    flexRowInCart.appendChild(deleteBtnContainerForMobile);
    deleteBtnContainerForMobile.appendChild(deleteBtnForMobile);
    flexRowInCart.appendChild(flexItem2);

    // ----------- cartProductContainer child -------------

    const cartProductImgContainer = document.createElement("div");
    cartProductImgContainer.className = "cartProductImgContainer";
    cartProductContainer.appendChild(cartProductImgContainer);
    const cartProductImg = document.createElement("img");
    cartProductImg.className = "cartProductImg";
    cartProductImg.setAttribute("src", item.img);
    cartProductImgContainer.appendChild(cartProductImg);

    const cartDetailsContainer = document.createElement("div");
    cartDetailsContainer.className = "cartDetailsContainer text-1";
    cartProductContainer.appendChild(cartDetailsContainer);

    createElement("p", "cartProductName", item.name, cartDetailsContainer);
    createElement("p", "cartProductId", item.id, cartDetailsContainer);
    createElement(
      "p",
      "cartProductColor",
      `顏色｜${item.color.name}`,
      cartDetailsContainer
    );
    createElement(
      "p",
      "cartProductSize",
      `尺寸｜${item.size}`,
      cartDetailsContainer
    );

    // ----------- flexItem2 child -------------

    const div1 = document.createElement("div");
    flexItem2.appendChild(div1);
    const p1 = document.createElement("p");
    p1.className = "forMobile text-1 text-center";
    p1.appendChild(document.createTextNode("數量"));
    const cartQtyValue = document.createElement("select");
    cartQtyValue.className = "cartQtyValue";
    flexItem2.appendChild(div1);
    div1.appendChild(p1);
    div1.appendChild(cartQtyValue);

    for (let i = 1; i <= item.stock; i++) {
      const option = document.createElement("option");
      option.setAttribute("value", i);
      if (i === item.qty) {
        option.setAttribute("selected", "selcted");
      }
      option.appendChild(document.createTextNode(i));
      cartQtyValue.appendChild(option);
    }

    const div2 = document.createElement("div");
    flexItem2.appendChild(div2);
    createElement("p", "forMobile text-1 text-center", "單價", div2);
    createElement("div", "cartProductPrice", `NT.${item.price}`, div2);

    const div3 = document.createElement("div");
    flexItem2.appendChild(div3);
    createElement("p", "forMobile text-1 text-center", "小計", div3);

    let curSubTotal = item.price * item.qty;

    const cartProductSubTotal = document.createElement("div");
    cartProductSubTotal.className = "cartProductSubTotal";
    cartProductSubTotal.setAttribute("curSubTotal", curSubTotal);
    cartProductSubTotal.appendChild(
      document.createTextNode(`NT.${curSubTotal}`)
    );
    div3.appendChild(cartProductSubTotal);

    const deleteBtnContainer = document.createElement("div");
    deleteBtnContainer.className = "deleteBtnContainer forWeb";
    flexItem2.appendChild(deleteBtnContainer);
    const deleteBtnForWeb = document.createElement("img");
    deleteBtnForWeb.className = "deleteBtnForWeb";
    deleteBtnForWeb.setAttribute("src", "./images/cart-remove.png");
    deleteBtnContainer.appendChild(deleteBtnForWeb);
  });

  // 算總金額
  let curTotalPrice = 0;
  for (let i = 0; i < dataInCart.length; i++) {
    curTotalPrice += dataInCart[i].price * dataInCart[i].qty;
  }
  if (curTotalPrice === 0) {
    curDeliveryFee = 0;
  }
  totalPrice.textContent = curTotalPrice;
  deliveryFee.textContent = curDeliveryFee;
  totalCharge.textContent = curTotalPrice + curDeliveryFee;

  changeQty();
  deleteRowForWeb();
  deleteRowForMobile();
};

printCart();

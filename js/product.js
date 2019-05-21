/*global getProductDetails numberInCart*/

// week2 part2 -- Product Details

const mainImg = document.querySelectorAll(".mainImg");
const productDetailTitle = document.querySelector(".productDetailTitle");
const productDetailId = document.querySelector(".productDetailId");
const productDetailPrice = document.querySelector(".productDetailPrice");
const selectForm = document.querySelector(".selectForm");
const colorBoxContainer = document.querySelector(".colorBoxContainer");
const colorBox = document.getElementsByClassName("colorBox");
const sizeBoxContainer = document.querySelector(".sizeBoxContainer");
const sizeBox = document.getElementsByClassName("sizeBox");
const quantitiesValue = document.querySelector(".quantitiesValue");
let curQuantity = Number(quantitiesValue.value);
const addToCartBtn = document.querySelector(".addToCartBtn");
const productDetailNote = document.querySelector(".productDetailNote");
const productDetailTexture = document.querySelector(".productDetailTexture");
const productDetailDescription = document.querySelector(
  ".productDetailDescription"
);
const materialPlace = document.querySelector(".materialPlace");
const processPlace = document.querySelector(".processPlace");
const moreDetails = document.querySelector(".moreDetails");

const querytString = window.location.search;
let id = querytString.slice(querytString.indexOf("=") + 1);
let curMainImg;
let curProductName;
let curProducPrice;
let curColorName;
let curColorCode;
let curSize;
let stockList;

const printProductDetails = foo => {
  mainImg[0].setAttribute("src", foo.data.main_image);
  mainImg[1].setAttribute("src", foo.data.main_image);
  productDetailTitle.appendChild(document.createTextNode(foo.data.title));
  productDetailId.appendChild(document.createTextNode(foo.data.id));
  productDetailPrice.appendChild(
    document.createTextNode(`TWD.${foo.data.price}`)
  );

  for (let i = 0; i < foo.data.colors.length; i++) {
    const colorBoxBorder = document.createElement("div");
    colorBoxBorder.setAttribute("class", "colorBoxBorder");
    const colorBox = document.createElement("div");
    colorBox.setAttribute("class", "colorBox");
    colorBox.setAttribute("colorCode", foo.data.colors[i].code);
    colorBox.setAttribute("colorName", foo.data.colors[i].name);
    colorBox.style.backgroundColor = `#${foo.data.colors[i].code}`;
    if (foo.data.colors[i].code === "FFFFFF") {
      colorBox.style.setProperty("border", "1px solid black");
    }
    colorBoxBorder.appendChild(colorBox);
    colorBoxContainer.appendChild(colorBoxBorder);
  }
  for (let i = 0; i < foo.data.sizes.length; i++) {
    const sizeBox = document.createElement("div");
    sizeBox.setAttribute("class", "sizeBox");
    sizeBox.appendChild(document.createTextNode(foo.data.sizes[i]));
    sizeBoxContainer.appendChild(sizeBox);
  }

  productDetailNote.appendChild(document.createTextNode(foo.data.note));
  productDetailTexture.appendChild(document.createTextNode(foo.data.texture));
  let str = foo.data.description;
  let str1 = str.slice(0, str.indexOf("\r\n"));
  let str2 = str.slice(str.indexOf("\r\n") + 1);
  let br = document.createElement("br");
  productDetailDescription.appendChild(document.createTextNode(str1));
  productDetailDescription.appendChild(br);
  productDetailDescription.appendChild(document.createTextNode(str2));
  materialPlace.appendChild(
    document.createTextNode(`素材產地/${foo.data.place}`)
  );
  processPlace.appendChild(
    document.createTextNode(`加工產地/${foo.data.place}`)
  );

  for (let i = 0; i < foo.data.images.length; i++) {
    const productDetailStory = document.createElement("div");
    productDetailStory.setAttribute("class", "productDetailStory");
    productDetailStory.appendChild(document.createTextNode(foo.data.story));

    const detailImgContainer = document.createElement("div");
    detailImgContainer.setAttribute("class", "detailImgContainer");
    const productDetailImg = document.createElement("img");
    productDetailImg.setAttribute("class", "productDetailImg");
    productDetailImg.setAttribute("src", foo.data.images[i]);
    detailImgContainer.appendChild(productDetailImg);

    moreDetails.appendChild(productDetailStory);
    moreDetails.appendChild(detailImgContainer);
  }
};

getProductDetails(id).then(foo => {
  printProductDetails(foo);
  stockList = foo.data.variants;
  curMainImg = foo.data.main_image;
  curProductName = foo.data.title;
  curProducPrice = foo.data.price;
});

// wee2 part3 --  Handle Product Variants

const getCurStockList = stockList => {
  return stockList.color_code == curColorCode && stockList.size == curSize;
};

selectForm.addEventListener("click", e => {
  if (e.target.classList.contains("colorBox")) {
    for (let i = 0; i < colorBox.length; i++) {
      colorBox[i].parentNode.classList.remove("colorBoxSelected");
    }
    e.target.parentNode.classList.add("colorBoxSelected");
    curColorCode = e.target.getAttribute("colorCode");
    curColorName = e.target.getAttribute("colorName");
    addToCartBtn.classList.remove("preventClicked");
    addToCartBtn.innerHTML = "加入購物車";

    curQuantity = 1;
    quantitiesValue.value = 1;
  }
  if (e.target.classList.contains("sizeBox")) {
    for (let i = 0; i < sizeBox.length; i++) {
      sizeBox[i].classList.remove("sizeBoxSelected");
    }
    e.target.classList.add("sizeBoxSelected");
    curSize = e.target.innerHTML;
    addToCartBtn.classList.remove("preventClicked");
    addToCartBtn.innerHTML = "加入購物車";
    curQuantity = 1;
    quantitiesValue.value = 1;
  }
  const curStockIndex = stockList.findIndex(getCurStockList);
  if (curStockIndex != -1) {
    const curProductStockQty = stockList[curStockIndex].stock;
    if (stockList[curStockIndex].stock == 0) {
      curQuantity = 0;
      quantitiesValue.value = 0;
      return;
    } else {
      if (e.target.classList.contains("quantitiesPlusBtn")) {
        if (curQuantity == curProductStockQty) return;
        addToCartBtn.classList.remove("preventClicked");
        addToCartBtn.innerHTML = "加入購物車";
        curQuantity += 1;
        quantitiesValue.value = curQuantity;
      }
      if (e.target.classList.contains("quantitiesMinusBtn")) {
        if (curQuantity == 1) return;
        addToCartBtn.classList.remove("preventClicked");
        addToCartBtn.innerHTML = "加入購物車";
        curQuantity -= 1;
        quantitiesValue.value = curQuantity;
      }
    }
  } else {
    if (e.target.classList.contains("btn")) {
      alert("請選擇您要的款式");
    }
  }
});

addToCartBtn.addEventListener("click", () => {
  const curStockIndex = stockList.findIndex(getCurStockList);
  if (curStockIndex == -1) {
    alert("請選擇您要的款式");
  } else if (stockList[curStockIndex].stock == 0) {
    alert("售完，補貨中！");
  } else {
    if (curQuantity == 0) return;
    addToCartFunc();
  }
});

const addToCartFunc = () => {
  const curStockIndex = stockList.findIndex(getCurStockList);
  const curProductStockQty = stockList[curStockIndex].stock;
  let dataOfProduct = {
    id: id,
    name: curProductName,
    price: curProducPrice,
    color: {
      name: curColorName,
      code: curColorCode
    },
    size: curSize,
    qty: curQuantity,
    img: curMainImg,
    stock: curProductStockQty
  };
  let cartArr = [];
  if (localStorage.getItem("cart") == "") {
    cartArr.push(dataOfProduct);
    localStorage.cart = JSON.stringify(cartArr);
  } else {
    cartArr = JSON.parse(localStorage.getItem("cart"));
    let cartIndex = cartArr.findIndex(cartArr => {
      return (
        cartArr.id == id &&
        cartArr.color.code == curColorCode &&
        cartArr.size == curSize
      );
    });
    if (cartIndex == -1) {
      cartArr.push(dataOfProduct);
    } else {
      if (curQuantity > curProductStockQty - cartArr[cartIndex].qty) {
        addToCartBtn.classList.add("preventClicked");
        addToCartBtn.innerHTML = `剩餘數量：${curProductStockQty -
          cartArr[cartIndex].qty}`;
        return;
      }
      cartArr[cartIndex].qty += curQuantity;
    }
    localStorage.cart = JSON.stringify(cartArr);
  }
  numberInCart.forEach(e => e.classList.remove("hidden"));
  numberInCart.forEach(
    e => (e.innerHTML = JSON.parse(localStorage.cart).length)
  );
};

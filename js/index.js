/* global get hostname getProducts createLoading getMarketingCampaigns  */
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/

const bodyContainer = document.querySelector(".bodyContainer");

const indexRender = foo => {
  for (let i = 0; i < foo.data.length; i++) {
    const productContainer = document.createElement("div");
    productContainer.setAttribute("class", "productContainer");
    bodyContainer.appendChild(productContainer);

    const aTag = document.createElement("a");
    aTag.setAttribute("href", `./product.html?id=${foo.data[i].id}`);
    const productImg = document.createElement("img");
    productImg.setAttribute("class", "productImg");
    productImg.setAttribute("src", foo.data[i].main_image);
    aTag.appendChild(productImg);

    const productDetails = document.createElement("div");
    productDetails.setAttribute("class", "productDetails");

    productContainer.appendChild(aTag);
    productContainer.appendChild(productDetails);

    const procductColor = document.createElement("div");
    procductColor.setAttribute("class", "procductColor");
    const procductName = document.createElement("div");
    procductName.setAttribute("class", "procductName");
    const procductPrice = document.createElement("div");
    procductPrice.setAttribute("class", "procductPrice");

    productDetails.appendChild(procductColor);
    productDetails.appendChild(procductName);
    productDetails.appendChild(procductPrice);

    procductName.appendChild(document.createTextNode(foo.data[i].title));
    procductPrice.appendChild(
      document.createTextNode("TWD." + foo.data[i].price)
    );

    for (let j = 0; j < foo.data[i].colors.length; j++) {
      const colorBox = document.createElement("div");
      colorBox.setAttribute("class", "colorBox");
      colorBox.style.background = "#" + foo.data[i].colors[j].code;
      if (foo.data[i].colors[j].code == "FFFFFF") {
        colorBox.style.setProperty("border", "1px solid black");
      }
      procductColor.appendChild(colorBox);
    }
  }
};

const indexRerender = foo => {
  while (bodyContainer.hasChildNodes()) {
    bodyContainer.removeChild(bodyContainer.firstChild);
  }
  indexRender(foo);
};
// First Page

const printProcducts = async (category = "all", page = 0) => {
  createLoading(bodyContainer);
  const loading = document.querySelector(".loading");
  let data = await getProducts(category, page);
  loading.classList.add("hidden");
  indexRender(data);
};

const rePrintProducts = async (category = "all", page = 0) => {
  while (bodyContainer.hasChildNodes()) {
    bodyContainer.removeChild(bodyContainer.firstChild);
  }
  printProcducts(category, page);
};

// Select category
const categoryContent = document.querySelectorAll(".categoryContent");
const women = document.querySelector(".women");
const men = document.querySelector(".men");
const accessories = document.querySelector(".accessories");
let category;

const removeCurrent = nodes =>
  nodes.forEach(item => {
    item.classList.remove("current");
  });

const printByCategory = () => {
  category = window.location.search.slice(10);
  switch (category) {
    case "":
      rePrintProducts("all", 0);
      removeCurrent(categoryContent);
      break;
    case "women":
      rePrintProducts("women", 0);
      removeCurrent(categoryContent);
      women.classList.add("current");
      break;
    case "men":
      rePrintProducts("men", 0);
      removeCurrent(categoryContent);
      men.classList.add("current");
      break;
    case "accessories":
      rePrintProducts("accessories", 0);
      removeCurrent(categoryContent);
      accessories.classList.add("current");
      break;
  }
};

printByCategory();

// week1 part4 -- Search Feature

const searchProducts = async (category, page = 0) => {
  createLoading(bodyContainer);
  const loading = document.querySelector(".loading");
  const endpoint = `/products/search?keyword=${category}&paging=${page}`;
  let data = await get(endpoint);
  loading.classList.add("hidden");
  indexRerender(data);
};

document.querySelector(".searchBtn").addEventListener("click", () => {
  if (window.innerWidth > 1200) {
    let category = document.querySelector(".searchInput").value;
    searchProducts(category, page);
  } else {
    const searchToggleBox = document.querySelector(".searchToggleBox");
    const searchInputForMobile = document.querySelector(
      ".searchInputForMobile"
    );
    if (searchInputForMobile.value === "") {
      searchToggleBox.classList.toggle("hidden");
    } else {
      let category = searchInputForMobile.value;
      searchProducts(category, (page = 0));
      searchToggleBox.classList.add("hidden");
    }
  }
});

// week1 part4 -- Paging Feature

let page = 0;
let data;
let isLoading = false;

const getNextPage = async () => {
  data = await getProducts(category, page);
  page = data.paging;
  if (page > 1) {
    indexRender(data);
  }
  isLoading = false;
};

window.addEventListener("scroll", () => {
  const bodyBottom = bodyContainer.getBoundingClientRect().bottom;
  const viewHeight = window.innerHeight;
  if (bodyBottom - viewHeight < 100 && !isLoading) {
    if (page !== undefined) {
      getNextPage();
      isLoading = true;
    }
  }
});

// week1 part5 -- Marketing Campaigns

const banner = document.querySelector(".banner");
const bannerSubtitle = document.querySelector(".bannerSubtitle");
const bannerTitle = document.querySelector(".bannerTitle");
const bannerSelector = document.querySelector(".bannerSelector");
const bannerDots = document.getElementsByClassName("dot");
let bannerIndex = 0;

const bannerRender = (foo, index) => {
  banner.style.backgroundImage = `url(http://${hostname}/${
    foo.data[index].picture
  })`;
  while (bannerSubtitle.hasChildNodes()) {
    bannerSubtitle.removeChild(bannerSubtitle.firstChild);
  }
  while (bannerTitle.hasChildNodes()) {
    bannerTitle.removeChild(bannerTitle.firstChild);
  }
  let story = foo.data[index].story;
  while (story.includes("\n")) {
    let bannerRow = story.slice(0, story.indexOf("\n") + 1);
    const creatNewDiv = document.createElement("div");
    bannerSubtitle.appendChild(creatNewDiv);
    creatNewDiv.appendChild(document.createTextNode(bannerRow));
    story = story.slice(story.indexOf("\n") + 1);
  }
  bannerTitle.appendChild(document.createTextNode(story));
};

//  點擊換頁功能

bannerSelector.addEventListener("click", e => {
  if (e.target.classList.contains("dot")) {
    for (let i = 0; i < bannerDots.length; i++) {
      bannerDots[i].classList.remove("dotCliked");
    }
    e.target.classList.add("dotCliked");
    bannerIndex = e.target.classList[1].slice(3);
    getMarketingCampaigns().then(foo => {
      bannerRender(foo, bannerIndex);
      return (bannerIndex = Number(e.target.classList[1].slice(3)));
    });
  }
});

// 輪播功能

getMarketingCampaigns().then(foo => {
  bannerRender(foo, bannerIndex);
  bannerDots[bannerIndex].classList.add("dotCliked");
  setInterval(() => {
    if (bannerIndex < foo.data.length - 1) {
      bannerIndex += 1;
    } else {
      bannerIndex = 0;
    }
    bannerRender(foo, bannerIndex);
    for (let i = 0; i < bannerDots.length; i++) {
      bannerDots[i].classList.remove("dotCliked");
    }
    bannerDots[bannerIndex].classList.add("dotCliked");
  }, 5000);
});

/*global postCheckOutData dataInCart totalCharge totalPrice deliveryFee*/

const submitButton = document.querySelectorAll(".submitBtn");
const cardNumberError = document.querySelector(".cardNumberError");
const cardExpiryError = document.querySelector(".cardExpiryError");
const cardCCVError = document.querySelector(".cardCCVError");

let canGetPrime = false;

TPDirect.setupSDK(
  12348,
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
  "sandbox"
);
TPDirect.card.setup({
  fields: {
    number: {
      element: "#card-number",
      placeholder: "**** **** **** ****"
    },
    expirationDate: {
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY"
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "後三碼"
    }
  },
  styles: {
    input: {
      color: "#313538",
      "font-size": "14px"
    },
    ".valid": {
      color: "#313538"
    },
    ".invalid": {
      color: "red"
    }
  }
});

TPDirect.card.onUpdate(function(update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    submitButton.forEach(item => {
      item.classList.remove("disabled");
    });
  } else {
    // Disable submit Button to get prime.
    submitButton.forEach(item => {
      item.classList.add("disabled");
    });
  }
  // number 欄位是錯誤的
  if (update.status.number === 2) {
    cardNumberError.classList.remove("hidden");
  } else if (update.status.number === 0) {
    cardNumberError.classList.add("hidden");
  }

  if (update.status.expiry === 2) {
    cardExpiryError.classList.remove("hidden");
  } else if (update.status.expiry === 0) {
    cardExpiryError.classList.add("hidden");
  }

  if (update.status.cvc === 2) {
    cardCCVError.classList.remove("hidden");
  } else if (update.status.cvc === 0) {
    cardCCVError.classList.add("hidden");
  }
});

const onSubmit = event => {
  event.preventDefault();
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    alert("can not get prime");
    return;
  }
  // Get prime
  TPDirect.card.getPrime(result => {
    if (result.status !== 0) {
      return;
    } else if (
      checkName() &&
      checkPhone() &&
      checkEmail() &&
      checkAdd() &&
      checkdeliveryTime()
    ) {
      let prime = result.card.prime;
      postCheckOutData(createCheckOutObj(prime)).then(foo => {
        localStorage.orderNumber = foo.data.number;
        window.location = "./thankyou.html";
        localStorage.removeItem("cart");
      });
    } else {
      alert("請確認是否完整填寫表單");
    }
  });
};

//  檢查資料填寫

const deliveryLocation = document.querySelector(".deliveryLocation");
const paymentTerm = document.querySelector(".paymentTerm");
const subscriberName = document.querySelector(".subscriberName");
const subscriberPhone = document.querySelector(".subscriberPhone");
const subscriberEmail = document.querySelector(".subscriberEmail");
const subscriberAdd = document.querySelector(".subscriberAdd");
const tpfield = document.querySelectorAll(".tpfield");

const checkName = () => {
  const nameError = document.querySelector(".nameError");
  if (subscriberName.value == "") {
    nameError.classList.remove("hidden");
    return false;
  } else {
    nameError.classList.add("hidden");
    return true;
  }
};

const checkPhone = () => {
  const phoneError = document.querySelector(".phoneError");
  const rePhone = /^[09]{2}[0-9]{8}$/;
  if (!rePhone.test(subscriberPhone.value)) {
    phoneError.classList.remove("hidden");
    return false;
  } else {
    phoneError.classList.add("hidden");
    return true;
  }
};

const checkEmail = () => {
  const emailError = document.querySelector(".emailError");
  const reEmail = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!reEmail.test(subscriberEmail.value)) {
    emailError.classList.remove("hidden");
    return false;
  } else {
    emailError.classList.add("hidden");
    return true;
  }
};

const checkAdd = () => {
  const addError = document.querySelector(".addError");
  if (subscriberAdd.value.length < 10) {
    addError.classList.remove("hidden");
    return false;
  } else {
    addError.classList.add("hidden");
    return true;
  }
};

const checkdeliveryTime = () => {
  const timeError = document.querySelector(".timeError");
  if (document.querySelector('input[name="time"]:checked') == null) {
    timeError.classList.remove("hidden");
    return false;
  } else {
    timeError.classList.add("hidden");
    return true;
  }
};

const createCheckOutObj = prime => {
  dataInCart.forEach(item => {
    delete item.img;
    delete item.stock;
  });
  let checkOutData = {
    prime: prime,
    order: {
      shipping: deliveryLocation.value,
      payment: paymentTerm.value,
      subtotal: totalPrice.textContent,
      freight: deliveryFee.textContent,
      total: totalCharge.textContent,
      recipient: {
        name: subscriberName.value,
        phone: subscriberPhone.value,
        email: subscriberEmail.value,
        address: subscriberAdd.value,
        time: document.querySelector('input[name="time"]:checked').value
      },
      list: dataInCart
    }
  };
  return checkOutData;
};

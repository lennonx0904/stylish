const loginContainer = document.querySelector(".loginContainer");
const userProfile = document.querySelector(".userProfile");
const userPhoto = document.querySelector(".userPhoto");
const userName = document.querySelector(".userName");
const userEmail = document.querySelector(".userEmail");
const logoutBtn = document.querySelector(".logoutBtn");

const checkLoginState = () => {
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      console.log("connected");
      console.log(response);
      localStorage.setItem("accessToken", response.authResponse.accessToken);
      FB.api("/me", { fields: "id,name,email,picture" }, foo => {
        loginContainer.classList.add("hidden");
        userProfile.classList.remove("hidden");
        userPhoto.setAttribute("src", foo.picture.data.url);
        userName.appendChild(document.createTextNode(`會員名稱: ${foo.name}`));
        userEmail.appendChild(
          document.createTextNode(`會員信箱: ${foo.email}`)
        );
        logoutBtn.classList.remove("hidden");
      });
    } else if (response.status === "not_authorized") {
      loginContainer.classList.remove("hidden");
      console.log("沒登入APP");
      console.log(response);
    } else {
      loginContainer.classList.remove("hidden");
      console.log("The user isn't logged in to Facebook.");
      console.log(response);
    }
  });
};

const fbLogout = () => {
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      FB.logout(function(response) {
        console.log("log out");
        loginContainer.classList.remove("hidden");
        userProfile.classList.add("hidden");
        logoutBtn.classList.add("hidden");
        userName.textContent = "";
        userEmail.textContent = "";
        localStorage.removeItem("accessToken");
      });
    }
  });
};

const hostName = "graph.facebook.com";

const getFB = api => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", api);
    xhr.send();
    xhr.onload = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(JSON.parse(this.responseText));
      }
    };
    xhr.onerror = function() {
      reject("error");
    };
  });
};

const getFBData = (userID, accessToken) => {
  const url = `https://${hostName}/${userID}?fields=name,email,picture&access_token=${accessToken}`;
  return getFB(url);
};

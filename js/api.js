/*eslint no-unused-vars: ["error", { "vars": "local" }]*/

const hostname = 'api.appworks-school.tw';
const apiVersion = '1.0'


const get = (api) => {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(this.responseText));
            }
        };
        xhr.open('GET', `https://${hostname}/api/${apiVersion}${api}`);
        xhr.send();
    });   
}


const getProducts = (category, page) => {
    const endpoint = `/products/${category}?paging=${page}`;
    return get(endpoint);
}

function getMarketingCampaigns() {
    const endpoint = `/marketing/campaigns`;
    return get(endpoint);
}

const getProductDetails = (id) => {
    const endPoint = `/products/details?id=${id}`;
    return get(endPoint);
}


const post = (api, data) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://${hostname}/api/${apiVersion}${api}`);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.accessToken}`);
        xhr.send(JSON.stringify(data));
        xhr.onload = function() { 
          if (xhr.readyState == 4 && xhr.status == 200) {
            resolve(JSON.parse(this.responseText));
          }
        };
        xhr.onerror = function(){reject('error')};
      })
}

const postCheckOutData = (checkOutData) => {
    const endPoint = '/order/checkout';
    return post(endPoint, checkOutData);
}


const createLoading = (parentNode) => {
    const loading = document.createElement('div');   
    loading.setAttribute('class', 'loading');
    const loadingImg = document.createElement('img');   
    loadingImg.setAttribute('src', './images/loading.gif');
    loading.appendChild(loadingImg);
    parentNode.appendChild(loading);
}

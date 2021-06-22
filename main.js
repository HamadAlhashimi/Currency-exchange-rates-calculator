import API_KEY from "./apiKey.js";
import data from "./data.js";

document.addEventListener("DOMContentLoaded", (e) => {
  initApp();
});

const initApp = () => {
  // make sure to only except numbers and only one decimal
  const amount = document.querySelector("#amount");
  amount.onkeydown = validateInputAmount;

  // swap the selected currencies
  const exchange = document.querySelector(".exchange");
  exchange.onclick = exchangeCurrencies;

  //Toggle the dropdown list
  const dropdown = document.querySelectorAll(".dropdown");
  dropdown.forEach((element) => (element.onclick = ToggleDropdownList));

  // hide dropdown if clicked outside dropdoen-lis
  document.onclick = hideDropdown;

  // populate dropdown list
  populateLists("from-wrapper");
  populateLists("to-wrapper");

  // set default currencies
  setCurrency("from-currency", "US");
  setCurrency("to-currency", "SA");

  //select currency
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => (item.onclick = selectCurrency));

  // convert amount
  const convertBtn = document.querySelector("#convert-btn");
  convertBtn.onclick = convertAmount;
};

const convertAmount = () => {
  const amount = document.querySelector("#amount").value;
  const fromCurrency = document.querySelector("#from-currency").lastChild.id;
  const toCurrency = document.querySelector("#to-currency").lastChild.id;

  if (amount.trim() === "") {
    alert("Please enter amount");
    return;
  }

  getResult(fromCurrency, toCurrency, amount);
};

const selectCurrency = (e) => {
  const itemElement = e.currentTarget;
  const topParentID = itemElement.parentNode.parentNode.id;

  if (topParentID === "from-wrapper") {
    const fromCurrency = document.querySelector("#from-currency");
    while (fromCurrency.firstChild) {
      fromCurrency.removeChild(fromCurrency.firstChild);
    }
    setCurrency("from-currency", itemElement.id);
  } else if (topParentID === "to-wrapper") {
    const toCurrency = document.querySelector("#to-currency");
    while (toCurrency.firstChild) {
      toCurrency.removeChild(toCurrency.firstChild);
    }
    setCurrency("to-currency", itemElement.id);
  }
};

const setCurrency = (idName, countryCode) => {
  const currency = document.querySelector(`#${idName}`);

  const img = document.createElement("img");
  img.src = data[countryCode].flag.path;
  img.alt = data[countryCode].name;

  const span = document.createElement("span");
  span.innerText = data[countryCode].currencyName;
  span.id = data[countryCode].currencyCode;

  currency.append(img);
  currency.append(span);
};

const populateLists = (idName) => {
  const dropdownContent = document.querySelector(`#${idName}`).querySelector(".dropdown-content");

  for (const key in data) {
    const div = document.createElement("div");
    div.id = key;
    div.className = "dropdown-item";

    const img = document.createElement("img");
    img.alt = data[key].name;
    img.src = data[key].flag.path;

    const span = document.createElement("span");
    span.innerText = data[key].currencyName;

    div.append(img);
    div.append(span);
    dropdownContent.append(div);
  }
};

const hideDropdown = (e) => {
  const clickedElement = e.target;
  const dropdownElements = document.querySelectorAll(".dropdown");
  const fromDropdownElement = dropdownElements[0];
  const from__i = fromDropdownElement.querySelector("i");
  const from__section = fromDropdownElement.querySelector("section");
  const from__img = from__section.querySelector("img");
  const from__span = from__section.querySelector("span");
  const toDropdownElement = dropdownElements[1];
  const to__i = toDropdownElement.querySelector("i");
  const to__section = toDropdownElement.querySelector("section");
  const to__img = to__section.querySelector("img");
  const to__span = to__section.querySelector("span");

  if (
    (clickedElement !== fromDropdownElement) &
    (clickedElement !== from__i) &
    (clickedElement !== from__section) &
    (clickedElement !== from__img) &
    (clickedElement !== from__span) &
    (clickedElement !== toDropdownElement) &
    (clickedElement !== to__i) &
    (clickedElement !== to__section) &
    (clickedElement !== to__img) &
    (clickedElement !== to__span)
  ) {
    const dropdownWrapper = document.querySelectorAll(".dropdown-wrapper");
    dropdownWrapper.forEach((element) => element.classList.remove("show-dropdown"));
  }
};

const validateInputAmount = (e) => {
  const amountHasDecimal = amount.value.includes(".") ? true : false;
  if (amountHasDecimal & e.code.includes("Period")) return false;
  return e.code.includes("Digit") | e.code.includes("Period") ? null : false;
};

const exchangeCurrencies = () => {
  const fromCurrency = document.querySelector("#from-currency");
  const toCurrency = document.querySelector("#to-currency");
  const temp = fromCurrency.innerHTML;
  fromCurrency.innerHTML = toCurrency.innerHTML;
  toCurrency.innerHTML = temp;
};

const ToggleDropdownList = (e) => {
  const dropdownWrapper = e.currentTarget.querySelector(".dropdown-wrapper");
  const fromDropdownWrapper = document.querySelector("#from-wrapper");
  const toDropdownWrapper = document.querySelector("#to-wrapper");

  if (
    (dropdownWrapper === fromDropdownWrapper) &
    toDropdownWrapper.classList.contains("show-dropdown")
  ) {
    toDropdownWrapper.classList.remove("show-dropdown");
  } else if (
    (dropdownWrapper === toDropdownWrapper) &
    fromDropdownWrapper.classList.contains("show-dropdown")
  ) {
    fromDropdownWrapper.classList.remove("show-dropdown");
  }
  dropdownWrapper.classList.toggle("show-dropdown");
};

const getResult = async (fromCurrency, toCurrency, amount) => {
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`
  );
  const dataObj = await res.json();
  dataObj["amount"] = amount;
  setResult(dataObj);
};

const setResult = (dataObj) => {
  const result = document.querySelector("#result");
  result.innerHTML = `${dataObj.amount} ${dataObj.base_code} = ${dataObj.conversion_result} ${dataObj.target_code}`;
};

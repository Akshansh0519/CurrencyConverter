const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") newOption.selected = true;
    if (select.name === "to" && currCode === "INR") newOption.selected = true;

    select.append(newOption);
  }
  select.addEventListener("change", (e) => updateFlag(e.target));
}

// Fetch exchange rate and update UI
async function updateExchangeRate() {
  let amt = parseFloat(document.querySelector(".amount input").value) || 1;
  document.querySelector(".amount input").value = amt;
  if (amt < 0) {
    msg.innerText = "⚠️ Please enter a valid amount.";
    return;
  }
  const url = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    const finalAmount = (amt * rate).toFixed(2);

    msg.innerText = `💱 ${amt} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    console.error(err);
    msg.innerText = "⚠️ Failed to fetch conversion rate.";
  }
}

// Update flag image
function updateFlag(el) {
  const cc = countryList[el.value];
  const img = el.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${cc}/flat/64.png`;
}

// Event listeners
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
  // Initialize flags
  dropdowns.forEach(select => updateFlag(select));
});

const searchInput = document.getElementById("search");
const countries = document.querySelector(".countries");
const searchDiv = document.getElementById("searchDiv");

let allCountries = [];

searchInput.addEventListener("input", () => {
  filterCountry(allCountries);
});

window.addEventListener("load", () => {
  searchDiv.classList.add("visually-hidden");
});

const getFilter = (e) => {
  searchDiv.classList.remove("visually-hidden");
  const countryList = document.querySelectorAll(".list");
  let text = e.target.value;
  var pat = new RegExp(text, "i");
  countryList.forEach((cntry) => {
    if (pat.test(cntry.innerText)) {
      cntry.classList.remove("visually-hidden");

      cntry.addEventListener("click", () => {
        searchDiv.classList.add("visually-hidden");
        const selectedCountry = allCountries.find(
          (country) => country.name.common === cntry.textContent
        );
        printCountry([selectedCountry]);
      });
    } else {
      cntry.classList.add("visually-hidden");
    }
  });
};

const filterCountry = (data) => {
  const searchTxt = searchInput.value.toLowerCase().trim();

  const fltrCountries = data.filter((country) => {
    return country.name.common.toLowerCase().startsWith(searchTxt);
  });

  if (fltrCountries.length > 0) {
    printCountry([fltrCountries[0]]);
  } else {
    countries.innerHTML = "";
  }
};
searchInput.addEventListener("keyup", getFilter);

//getcountry
const getData = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  try {
    if (!res.ok) {
      throw new Error("Error", res.status);
    }
  } catch (err) {
    console.log(err);
  }
  const data = await res.json();
  getCountryName(data);
  allCountries = data;
  printCountry(data);
};
getData();

const getCountryName = (data) => {
  data.forEach((x) => {
    const countryList = document.createElement("span");
    countryList.setAttribute("role", "button");
    countryList.classList.add("list");
    countryList.textContent = x.name.common;
    searchDiv.appendChild(countryList);
  });
};

const printCountry = (item) => {
  const countries = document.querySelector(".countries");
  const countryDiv = document.createElement("div");
  countries.innerHTML = "";
  item.forEach((country) => {
    const languages = country.languages
      ? Object.values(country.languages).join(", ")
      : "Not available";
    const currency = country.currencies
      ? `${country.currencies[Object.keys(country.currencies)[0]].name}, ${
          country.currencies[Object.keys(country.currencies)[0]].symbol
        }`
      : "Not available";

    countryDiv.innerHTML = `
    <div class="card shadow-lg" style="width: 22rem">
    <img src="${country.flags.png}" class="card-img-top shadow" alt="Flag" />
    <div>
        <h5 class="p-2 text-center">${country.name.common}</h5>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">
        Region: ${country.region}</li>
        <li class="list-group-item">Capitals: ${country.capital}</li>
        <li class="list-group-item">Languages: ${languages}</li>
        <li class="list-group-item">Currencies: ${currency}</li>
        <li class="list-group-item">Population: ${country.population.toLocaleString()}</li>
        <li class="list-group-item">Borders: ${country.borders || "None"}</li>
        <li class="list-group-item">Map: <a href="${
          country.maps.googleMaps
        }" target='_blank'>Go to Google Maps</a></li>
    </ul>
  </div>`;

    countries.appendChild(countryDiv);
  });
};

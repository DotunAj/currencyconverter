const baseCurrency = document.querySelector('#base-currency');
const toCurrency = document.querySelector('#to-currency');


fetch("https://free.currencyconverterapi.com/api/v5/currencies")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
       const html = generateHtml(Object.values(data.results))
       baseCurrency.innerHTML = html;
       toCurrency.innerHTML = html;
       baseCurrency.querySelector('[value="Nigerian Naira"]').selected = true;
       toCurrency.querySelector('[value="United States Dollar"]').selected = true;
    })

function generateHtml(stuffs) {
    return stuffs.map(stuff => {
        return `
        <option value="${stuff.currencyName}">${stuff.id}</option>
        `
    }).join(' ');
}

//TODO: Implement the covertion itself




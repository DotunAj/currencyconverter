const baseCurrency = document.querySelector('#base-currency');
const toCurrency = document.querySelector('#to-currency');
let showingCurrency = false;

const dbPromise = idb.open('c-currency', 1, (upgradeDb) => {
    keyVal = upgradeDb.createObjectStore('currencies', {keyPath: 'id'});
})

fetch("https://free.currencycoverterapi.com/api/v5/currencies")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        //generate and display html and
       //populate the idb database with currency juice
       const currencies = Object.values(data.results);
       const html = generateHtml(currencies)
       displayHtml(html);
       //Flag to check is the currencies are being displayed to the user
       //It will be useful for offline situations
       showingCurrency = true;
       dbPromise.then((db) =>{
           if(!db) return;
           const tx = db.transaction('currencies', 'readwrite');
           const store = tx.objectStore('currencies')
           currencies.forEach(currency => {
               store.put(currency);
           });
       });
    })

function generateHtml(stuffs) {
    return stuffs.map(stuff => {
        return `
        <option value="${stuff.id}">${stuff.id}</option>
        `
    }).sort().join(' ');
}

function displayHtml(html) {
    baseCurrency.innerHTML = html;
    toCurrency.innerHTML = html;
    baseCurrency.querySelector('[value="NGN"]').selected = true;
    toCurrency.querySelector('[value="USD"]').selected = true;
}

//This will get the currencies from the idb when app is offline
if(!showingCurrency) {
    dbPromise.then((db) => {
        if(!db) return;
        const tx = db.transaction('currencies');
        const store = tx.objectStore('currencies');
        store.getAll().then((currencies) => {
            html = generateHtml(currencies);
            displayHtml(html);
            showingCurrency = true;
        })
    })
}

//TODO: Implement the service worker to cache static content
//TODO: Implement the covertion itself





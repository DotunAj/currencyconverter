const baseCurrency = document.querySelector('#base-currency');
const toCurrency = document.querySelector('#to-currency');
const baseAmountInput = document.querySelector('#from-amount');
const toAmountInput = document.querySelector('#to-amount');
const convertButton = document.querySelector('.convert')
let showingCurrency = false;

if(navigator.serviceWorker){
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
        .then((reg) => {
            if(!navigator.serviceWorker.controller) return;

            if(reg.waiting) {
                updateServiceWorker(reg.waiting);
                return;
            }

            if(reg.installing) {
                trackSwInstalling(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', () => {
                trackSwInstalling(reg.installing);
            })
        })
        .catch((err) => {
            console.log(err);
        })
    })
}

//Function to track service Worker installing process
function trackSwInstalling(worker) {
    worker.addEventListener('statechange', ()=> {
        if(worker.state === 'installed'){
            updateServiceWorker(worker)
        }
    });
}

//Function that automatically updates worker when a new version ships
function updateServiceWorker(worker) {
    worker.postMessage({action:'skipWaiting'});
}

const dbPromise = idb.open('c-currency', 1, (upgradeDb) => {
    const keyVal = upgradeDb.createObjectStore('currencies', {keyPath: 'id'});
    const rates = upgradeDb.createObjectStore('rates');
})

fetch("https://free.currencyconverterapi.com/api/v5/currencies")
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        //generate and display html and
       const currencies = Object.values(data.results);
       const html = generateHtml(currencies)
       displayHtml(html);
       //populate the idb database with currency data
       dbPromise.then((db) => {
           if(!db) return;
           const tx = db.transaction('currencies', 'readwrite');
           const store = tx.objectStore('currencies')
           currencies.forEach(currency => {
               store.put(currency);
           });
       });
    })
    .catch(() => {
        //if everything goes south currency data will be gotten from idb
        dbPromise.then((db) => {
            if(!db) return;
            const tx = db.transaction('currencies');
            const store = tx.objectStore('currencies');
            store.getAll().then((currencies) => {
                if(currencies.length === 0) {
                    //TODO: Implement UX for when there is no currency data in the idb
                    return
                }
                //Only run if there is data in the db
                html = generateHtml(currencies);
                displayHtml(html);
            })
        })
    })


//function to generate the html for the select option
function generateHtml(stuffs) {
    return stuffs.map(stuff => {
        return `
        <option value="${stuff.id}">${stuff.id}</option>
        `
    }).sort().join(' ');
}

//function to add the html of the select option to the DOM
function displayHtml(html) {
    baseCurrency.innerHTML = html;
    toCurrency.innerHTML = html;
    baseCurrency.querySelector('[value="NGN"]').selected = true;
    toCurrency.querySelector('[value="USD"]').selected = true;
}

//function that does the major convertion from one currency to another
function convertCalculation(rate, amount) {
    const rateArr = Object.values(rate);
    return rateArr[0]* amount
}

//functon that handles the click event of the convertion button
function handleClick() {
    let from = baseCurrency.value;
    let to = toCurrency.value;
    const fromAmount = baseAmountInput.value;
    let query = `${from}_${to}`;
    let convertUrl = new URL(`https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra`);
    //Fetch the rate
    //Covert from one currency to another with fetched rate
    //Stored rate in idb for offline usage
    fetch(convertUrl)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            //TODO: Implement Loader for the converting action
            toAmountInput.value = convertCalculation(data, fromAmount);
            dbPromise.then((db) => {
                if(!db) return;
                let tx = db.transaction('rates', 'readwrite');
                let store = tx.objectStore('rates');
                store.put(data, `${from}_${to}`);
            })
        })
        .catch((err) => {
            //When offline get the rate from idb
            dbPromise.then((db) => {
                if(!db) return;
                let tx = db.transaction('rates');
                let store = tx.objectStore('rates');
                store.openCursor().then( function doAgain(cursor) {
                    if (!cursor) return;
                    if(cursor.key === query){
                        toAmountInput.value = convertCalculation(cursor.value, fromAmount);
                        return;
                    }
                    return cursor.continue().then(doAgain);
                }).then(() => {
                    //TODO: UX for when the rates are not found in the idb
                })
            })
        })
}

convertButton.addEventListener('click', handleClick);





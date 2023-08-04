const form = document.getElementById("calculate");
const chart = document.getElementById("myChart");
let myChart;

// Getting coins
const gettingCoins = async (coin) => {
    try {
        const values = await fetch("https://mindicador.cl/api/${coin}")
        const results = await values.json();
        return results.serie;
    }
    catch (error) {
        alert(error.message);
    }
};

// Calculating coins
const calculateCoinsTotal = (value, data) => {
    const coinValue = data [0].value;
    const total = value / coinValue;
    return Math.round (total*100)/100;
};


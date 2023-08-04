const form = document.querySelector("#calculate");
const chart = document.querySelector("#myChart");
let myChart;

// Getting coins
const gettingCoins = async (coin) => {
    try {
        const values = await fetch(`https://mindicador.cl/api/${coin}`);
        const results = await values.json();
        return results.serie;
    } catch (error) {
        alert(error.message);
    }
};

// Calculating coins
const calculateCoinsTotal = (value, datos) => {
    const coinValue = datos[0].value;
    const total = value / coinValue;
    return Math.round(total * 100) / 100; //to get integers without decimals
};

// Showing results
const showResults = (total) => {
    document.querySelector("#totalValue").innerHTML = total;
};

// Mapping data
const obteinValues = (datos) => {
    return datos.map((item) => item.value);
};

// Obtein dates
const obteinDates = (datos) => {
    return datos.map((item) => new Date(item.date).toLocaleDateString("en-US"));
};

// Destroy graphic. The idea is to destroy a previous graphic so when we need a new one it doesn't overlap
const destroyPreviousGraphic = () => {
    if (myChart) {
        myChart.destroy();
    }
};

// Calculate value on coins
const calculateCoinsValue = async (value, coin) => {
    const datos = await gettingCoins(coin);
    showGraphic(datos, value);
};

// Show graphic
const showGraphic = (datos, value) => {
    const total = calculateCoinsTotal(value, datos);
    showResults(total);

    const labels = obteinDates(datos);
    const values = obteinValues(datos);

    const datasets = [
        {
            label: "Coin",
            borderColor: "black",
            data: values,
        },
    ];

    const config = {
        type: "line",
        data: { labels, datasets },
    };

    destroyPreviousGraphic();

    chart.style.backgroundColor = "violet";
    chart.style.borderRadius = "2rem";

    myChart = new Chart(chart, config);
};

// Submit event on form
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = form.elements["value"].value;
    const coin = form.elements["coin"].value;

    if (!value) {
        alert("Type a value");
        return;
    }
    if (!coin) {
        alert("Select coin");
        return;
    }

    await calculateCoinsTotal(value, coin);
});

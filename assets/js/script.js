const form = document.querySelector("#calculate");
const chart = document.querySelector("#myChart");
const refreshIcon = document.querySelector("#refresh");
let myChart;

// Getting coins
const gettingCoins = async (codigo) => {
    try {
        const valores = await fetch(`https://mindicador.cl/api/${codigo}`);
        const results = await valores.json();
        return results.serie;
    } catch (error) {
        alert(error.message);
    }
};

// Calculating coins
const calculateCoinsTotal = (valores, datos) => {
    const coinValue = datos[0].valor;
    const total = valores / coinValue;
    return Math.round(total * 100) / 100; //to get integers without decimals
};

// Showing results
const showResults = (total) => {
    document.querySelector("#totalValue").innerHTML = total;
};

// Mapping data
const obteinValues = (datos) => {
    return datos.map((item) => item.valor);
};

// Obtein dates
const obteinDates = (datos) => {
    return datos.slice(0, 10).map(
        (item) => new Date(item.fecha).toLocaleDateString("en-US") //fecha because the API's spanish, slice -10 to get last 10 dates
    );
};

// Destroy graphic. The idea is to destroy a previous graphic so when we need a new one it doesn't overlap
const destroyPreviousGraphic = () => {
    if (myChart) {
        myChart.destroy();
    }
};

// Calculate value on coins
const calculateCoinsValue = async (valor, moneda) => {
    const datos = await gettingCoins(moneda);
    showGraphic(datos, valor);
};

// Show graphic
const showGraphic = (datos, valor) => {
    const total = calculateCoinsTotal(valor, datos);
    showResults(total);

    const labels = obteinDates(datos);
    const values = obteinValues(datos);

    const datasets = [
        {
            label: "Coin",
            borderColor: "rgb(170, 130, 238)",
            borderWidth: 2,
            data: values,
        },
    ];

    const config = {
        type: "line",
        data: { labels, datasets },
    };

    destroyPreviousGraphic();

    chart.style.backgroundColor = "rgba(238, 130, 238, 0.3)";
    chart.style.borderRadius = "2rem";
    chart.style.padding = "2rem";
    chart.style.margin = "2rem";

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

    await calculateCoinsValue(value, coin);
});

// Refreshing website
const refresh = () => {
    location.reload(true);
};

refreshIcon.addEventListener("click", refresh);
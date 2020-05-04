const heading = document.getElementById("heading");
const confirmed = document.getElementById("confirmed");
const recovered = document.getElementById("recovered");
const date_one = document.querySelector(".date-one");
const date_two = document.querySelector(".date-two");
const date_three = document.querySelector(".date-three");
const total = document.getElementById("death");
const graph = document.getElementById("chart");

const default_bar = "horizontalBar";

let dummy;

const global_data = () => {
    fetch("https://covid19.mathdro.id/api")
        .then((res) => res.json())
        .then((res) => {
            confirmed.innerHTML = res.confirmed.value;
            recovered.innerHTML = res.recovered.value;
            total.innerHTML = res.deaths.value;
            dummy = res.lastUpdate;
            let d = dummy.substr(0, dummy.lastIndexOf("T"));
            date_one.innerHTML = d;
            date_two.innerHTML = d;
            date_three.innerHTML = d;
            let graph_array = [
                res.confirmed.value,
                res.recovered.value,
                res.deaths.value,
            ];
            generateGraph(default_bar, graph_array, ["Confirmed", "Recovered", "Dead"]);
        });
};

const load_options = () => {
    let elements = document.getElementById("selects");

    fetch("https://covid19.mathdro.id/api/countries")
        .then((res) => res.json())
        .then((res) => {
            res.countries.map((r) => {
                let data = createList(r.name);
                elements.appendChild(data);
            });
        });
};

const country_data = (e) => {
    let data = e.target.value;
    if (e.target.value == "Global") {
        fetch("https://covid19.mathdro.id/api")
            .then((res) => res.json())
            .then((res) => {
                confirmed.innerHTML = res.confirmed.value;
                recovered.innerHTML = res.recovered.value;
                total.innerHTML = res.deaths.value;
                let graph_array = [
                    res.confirmed.value,
                    res.recovered.value,
                    res.deaths.value,
                ];
                generateGraph(default_bar, graph_array, ["Confirmed", "Recovered", "Dead"]);
            });
    } else {
        fetch_api(data);
    }
};

const daily_data = () => {
    let confirmed_arr = [];
    let date = [];
    fetch("https://covid19.mathdro.id/api/daily")
        .then(res => res.json())
        .then((res) => {
            res.map((r) => {
                confirmed_arr.push(r.totalConfirmed);
                date.push(r.reportDate);
            });
        })
    generateGraph(default_bar, confirmed_arr, date);
}



const fetch_api = (endpoint) => {
    console.log(endpoint);
    fetch(`https://covid19.mathdro.id/api/countries/${endpoint}`)
        .then((res) => res.json())
        .then((res) => {
            confirmed.innerHTML = res.confirmed.value;
            recovered.innerHTML = res.recovered.value;
            total.innerHTML = res.deaths.value;
            let graph_array = [
                res.confirmed.value,
                res.recovered.value,
                res.deaths.value,
            ];

            generateGraph(default_bar, graph_array, ["Confirmed", "Recovered", "Dead"]);
        });
};

let coronaPopChart;

const generateGraph = (bar_type, series_arr, labels_arr) => {
    console.log(bar_type, series_arr, labels_arr);
    let myChart = document.getElementById("myChart").getContext("2d");

    // Global Options
    Chart.defaults.global.defaultFontFamily = "Reem Kufi";
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = "#777";

    if (coronaPopChart) {
        coronaPopChart.destroy();

    }

    coronaPopChart = new Chart(myChart, {
        type: bar_type,
        data: {
            labels: labels_arr,
            datasets: [{
                label: "",
                data: series_arr,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(75, 192, 192)'

                ], //'#39A1FF',
                borderWidth: 1,
                borderColor: "white",
                hoverBorderWidth: 2,
                hoverBorderColor: "white",
            }, ],
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: "",
                fontSize: 25,
            },
            legend: {
                display: false,
            },
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    bottom: 50,
                    top: 50,
                },
            },
            tooltips: {
                enabled: true,
                position: 'nearest',
                mode: 'index',
                intersect: false,
                yPadding: 10,
                xPadding: 10,
                caretSize: 8,
                backgroundColor: 'rgba(237, 237, 237)',
                titleFontColor: "black",
                bodyFontColor: "black",
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2
            },
        },
    });
};

const createList = (data) => {
    let option = document.createElement("option");
    option.value = data;
    option.innerHTML = data;
    return option;
};

// Event Listener
document.addEventListener("DOMContentLoaded", load_options);
document.addEventListener("change", country_data);



global_data();
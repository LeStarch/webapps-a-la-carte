/**
 * index.js:
 *
 * Index JavaScript file used to launch the application.  Imports the visualization and databasing functions.
 */
import {setup as visualization_setup, update as visualization_update} from "./visualization.js"
import {get_dataset, add_to_dataset} from "./elastic.js"

/**
 * Setup this application by querying datasets and adding event listeners.
 */
function setup() {
    document.getElementById("in-mass-btn").addEventListener("click", submitMass);
    document.getElementById("in-kcal-btn").addEventListener("click", submitKcal);

    let labels = ["Weight", "Calories"];
    visualization_setup("visualization", labels);
    // Weight straight to visualization
    get_dataset("Weight").then((response) => {
        visualization_update(response.dataset, response.data);
    }).catch(console.error);
    // Calories bucked into dates
    get_dataset("Calories").then((response) => {
        let data = aggregrate_by_date(response.data);
        visualization_update(response.dataset, data);
    }).catch(console.error);
}

/**
 * Aggregates a dataset that could be visualized individually into date-based summations.
 * @param data: list of {value: int, timestamp: Date} pairs
 * @returns list of {value: int, timestamp: Date-only} pairs
 */
function aggregrate_by_date(data) {
    let aggregation = {};
    for (let i = 0; i < data.length; i++) {
        let date = data[i].timestamp.toDateString();
        aggregation[date] = (aggregation[date] || 0) + data[i].value;
    }
    return Object.entries(aggregation).map(([key, value]) => ({"timestamp": new Date(key), "value": value}));
}

/**
 * Handle the submission of the mass box.
 * @param e: unused event parameter
 */
export function submitMass(e) {
    let errorBox = document.getElementById("error-box");
    let value = parseInt(document.getElementById("in-mass-number").value);
    if (value >= 100 && value <= 300)
    {
        errorBox.setAttribute("hidden", null);
        add_to_dataset("Weight", value).catch(console.error);
        setTimeout(() => {location.reload()}, 5000);
    } else {
        errorBox.removeAttribute("hidden");
        errorBox.innerText = "Mass must be between 100 and 300 pounds";
    }
}

/**
 * Handle the submission of the KCal box.
 * @param e: unused event parameter
 */
export function submitKcal(e) {
    let errorBox = document.getElementById("error-box");
    let value = parseInt(document.getElementById("in-kcal-number").value);
    if (value >= 0 && value <= 4000)
    {
        errorBox.setAttribute("hidden", null);
        add_to_dataset("Calories", value).catch(console.error);
        setTimeout(() => {location.reload()}, 5000);
    } else {
        errorBox.removeAttribute("hidden");
        errorBox.innerText = "Calories must be between 0 and 4000 KCal";
    }
}

// Register and setup
$(document).ready(setup);

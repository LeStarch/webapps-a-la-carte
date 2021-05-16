/**
 * Visualization handling code.
 */
let _chart = null;
let _colors = ['rgb(255,0,200)', 'rgb(0,186,255)'];
let _color_index = -1;
let pan_zoom_settings = {enabled: true, mode: 'x'};

/**
 * Setup the graphing/chart
 * @param elementId: elementId for graphing
 * @param labels: labels for each dataset
 */
export function setup(elementId, labels) {
    let datasets = labels.map((label) => {
        _color_index = _color_index + 1;
        return {
            label: label,
            yAxisID: label.toLowerCase(),
            borderColor: _colors[_color_index],
            backgroundColor: _colors[_color_index]
        }});
    // Setup a chart with given context
    let ctx = document.getElementById(elementId);
     _chart = new Chart(ctx, {
        type: 'scatter',
        data: { labels: labels, datasets: datasets},
        options: {
            responsive: true,
            showLine: true,
            scales: {
                x: {
                    display: true,
                    type: "time",
                    min: new Date(new Date().getTime() - (24 * 3600000 * 20)),
                },
                weight: {
                    type: "linear",
                    position: "left",
                    suggestedMin: 180,
                    suggestedMax: 250
                },
                calories: {
                    type: "linear",
                    position: "right",
                    suggestedMin: 1000,
                    suggestedMax: 4000,
                    gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                }
            },
            plugins: {
                zoom: {zoom: pan_zoom_settings, pan: pan_zoom_settings},
            }
        }
    });
}

/**
 * Find a dataset based on the given label
 * @param label: label of the dataset
 */
function find_dataset(label) {
    let label_index = _chart.data.labels.indexOf(label);
    if (label_index == -1) {
        throw new Error(label + " not available");
    }
    return _chart.data.datasets[label_index];
}

/**
 * Visualize a set of data points for this project.
 * @param label: label of dataset that is being updated
 * @param datapoints: list of value,time pairs
 */
export function update(label, datapoints) {
    let datas = datapoints.map((item) => ({x: item.timestamp, y:item.value}));
    try {
        find_dataset(label).data = datas;
        _chart.update();
    } catch (e) {
        console.error(e);
    }
}
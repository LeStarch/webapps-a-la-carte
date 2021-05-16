/**
 * For poking the web endpoint.
 */
let endpoint = "/matrix"
let last_input = null;
let last_output = null;

function setEnabled(enabled) {
    let buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = !enabled;
    }
}

function ajax(url, data) {
    let xhr = new XMLHttpRequest();
    xhr.open((typeof(data) !== "undefined" && data != null) ? "PUT" : "GET", url);

    // What to do when finished
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            setEnabled(true);
        }
    };
    setEnabled(false);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
}

function updateIfPossible() {
    // Send our update if we have seen both variables
    if (last_input != null && last_output != null) {
        ajax(endpoint + "/" + last_output, '{"input":' + last_input + '}');
        last_input = null;
        last_output = null;
    }
}

function onInputClick(id) {
    last_input = id;
    updateIfPossible();
}

function onOutputClick(id) {
    last_output = id;
    updateIfPossible();
}

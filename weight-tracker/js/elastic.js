/**
 * ElasticSearch (database) handling code.
 */
let ELASTIC="/elastic";

/**
 * Process the elastic response into timestamp/value pairs.
 * @param response: response from elasticsearch
 * @param label: label that was queried (pass-through)
 * @param success: function to call on success
 */
function process_elasitc_respone(response, label, success) {
    let sources = response.hits.hits.map((doc) => doc._source);
    let datas = sources.map((doc) => ({"timestamp": new Date(doc.timestamp), "value": doc.value}));
    success({dataset: label, data: datas});
}

/**
 * Get the full dataset from elasticsearch
 * @param dataset: dataset name to query
 */
export function get_dataset(dataset) {
    let url_build = ELASTIC + dataset.toLowerCase()+'/_search?q=*:*&size=10000';

    return new Promise((succ, error) => {
        $.get({
            url: url_build,
            dataType: "json",
        }).done((resp) => {process_elasitc_respone(resp, dataset, succ)}).fail(error);
    });
}

/**
 * Add new data to dataset
 * @param dataset: dataset name to submit to
 * @param value: value
 */
export function add_to_dataset(dataset, value) {
    let url_build = ELASTIC + dataset.toLowerCase() + "/_doc";
    return new Promise((succ, error) => {
        $.ajax({
            method: "POST",
            url: url_build,
            contentType: 'application/json',
            data: JSON.stringify({"timestamp": new Date().toISOString(), "value": value}),
        }).done(succ).fail(error);
    });
}
"use strict";

class Ajax {
  // Properties
  _URL = "https://randomuser.me";

  // Methods
  // method può essere GET oppure POST
  // url = rappresenta la risorsa da chiedere al server (es /api)
  // parameters = contiene i parametri della richiesta scritti in formato JSON
  // in caso di chiamata GET, sarà sendRequest a convertire questi parametri in url-encoded e accodarli alla URL
  /**
   *
   * @function sendRequest sends or request data to/from server. In case of GET request, this functions converts parameters to URL-encoded format and appends them to the URL.
   * @param {method} method can be either GET or POST
   * @param {url} url represents the resource to request from server (eg. /api)
   * @param {parameters} parameters contains the parameters of the request written in JSON format
   * @returns  returns a Promise object representing the eventual completion (or failure) of the asynchronous operation.
   */
  sendRequest(method, url, parameters = {}) {
    let options = {
      baseURL: this._URL, // indirizzo del server
      url: url, // risorsa da richiedere
      method: method.toUpperCase(), //metodo da usare per la richiesta
      headers: { Accept: "application/json" }, // consigliata
      responseType: "json", // indica il formato dei dati che andremo a ricevere
      timeout: 5000, // tempo massimo di attesa della risposta (5 sec)
    };

    if (method.toUpperCase() == "GET") {
      // definisco il Content-Type dell'urlencoded
      options.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=utf-8";
      options.params = parameters;
    } else {
      // nelle chiamate diverse da GET, i parametri saranno passati in JSON
      options.headers["Content-Type"] = "application/json;charset=utf-8";
      options.data = parameters; // scrive i parametri nel body dell'http request
    }
    let promise = axios(options); //axios restituisce una Promise
    return promise;
  }

  /**
   * @function errore Handles errors occurred during the AJAX request.
   * @param {err} err represents the error object returned by the AJAX request.
   */
  errore(err) {
    if (!err.response) alert("Connection Refused or Server timeout");
    else if (err.response.status == 200)
      alert("Formato dei dati non corretto : " + err.response.data);
    else
      alert("Server Error: " + err.response.status + " - " + err.response.data);
  }
}

let ajax = new Ajax();

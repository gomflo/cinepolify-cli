#!/usr/bin/env node

const got = require("got");
const { prompt } = require('enquirer');
const c = require('ansi-colors');
const log = console.log;
const humanizeString = require('humanize-string');
const urlCities = "https://cinepolis.com/manejadores/CiudadesComplejos.ashx?EsVIP=false";
const url = "https://cinepolis.com/Cartelera.aspx/GetNowPlayingByCity";

(async () => {
  const citiesResponse = await got.post(urlCities, { json: true });

  // <- ciudades
  const citiesArray = [];
  citiesResponse.body.map(value => {
    let tempCities = {};
    tempCities.message = value.Nombre;
    tempCities.name = value.Clave;
    tempCities.value = value.Clave;
    citiesArray.push(tempCities);
  });

  const citiesQuestions = {
    type: "autocomplete",
    name: "city",
    message: "Selecciona una ciudad",
    limit: 10,
    choices: citiesArray,
    format: value => humanizeString(value)
  };

  const citiesAnswer = await prompt(citiesQuestions);
  const params = { claveCiudad: citiesAnswer.city, esVIP: false };
  const response = await got.post(url, { body: params, json: true });
  const responseBody = response.body.d;
  const cinemasObject = responseBody.Locations;
  const values = Object.keys(cinemasObject);

  const cinemas = [];
  values.forEach(value => {
    let o = {};
    o.value = value;
    o.message = cinemasObject[value];
    cinemas.push(o);
  });

  // <- cines
  const cinemasQuestions = {
    type: "select",
    name: "cinema",
    message: "Selecciona un cine",
    choices: cinemas,
    format: value => humanizeString(value)
  };

  const cinemasAnswer = await prompt(cinemasQuestions);
  const [cinema] = responseBody.Cinemas.filter(value => value.Key === cinemasAnswer.cinema);
  const datesArray = cinema.Dates.map(value => value.ShowtimeDate);

  // <- fechas
  const datesQuestions = {
    type: "select",
    name: "date",
    message: "Seleccciona un día",
    choices: datesArray
  };

  const datesAnswer = await prompt(datesQuestions);
  const [moviesArray] = cinema.Dates.filter(
    value => value.ShowtimeDate === datesAnswer.date
  );
  const movies = moviesArray.Movies.map(value => value.Title);

  // <- películas
  const moviesQuestions = {
    type: "select",
    name: "movie",
    message: "Seleccciona un película",
    pageSize: 20,
    choices: movies
  };

  const moviesAnswer = await prompt(moviesQuestions);
  const [formatsArray] = moviesArray.Movies.filter(
    value => value.Title === moviesAnswer.movie
  );
  const [showTimesArray] = formatsArray.Formats;
  const showTimes = showTimesArray.Showtimes.map(value => value.ShowtimeAMPM);
  log(c.cyanBright(" ·"), showTimes.join(c.cyanBright(" · ")));

})();

const humanizeString = require("humanize-string");
const { prompt } = require("enquirer");

exports.city = async cities => {
  const citiesQuestions = {
    type: "autocomplete",
    name: "city",
    message: "Selecciona una ciudad",
    limit: 10,
    choices: cities,
    format: value => humanizeString(value)
  };

  return prompt(citiesQuestions);
};

exports.cinema = async cinemas => {
  const cinemasQuestions = {
    type: "select",
    name: "cinema",
    message: "Selecciona un cine",
    choices: cinemas,
    format: value => humanizeString(value)
  };

  return prompt(cinemasQuestions);
};

exports.date = async dates => {
  const datesQuestions = {
    type: "select",
    name: "date",
    message: "Seleccciona un día",
    choices: dates
  };

  return prompt(datesQuestions);
}

exports.movie = async movies => {
  const moviesQuestions = {
    type: "select",
    name: "movie",
    message: "Seleccciona un película",
    pageSize: 20,
    choices: movies
  };

  return prompt(moviesQuestions);
}
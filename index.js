#!/usr/bin/env node
const c = require("ansi-colors");
const cinepolis = require("./cinepolis");
const pick = require("./pick");

(async () => {
  const cities = await cinepolis.getCities();
  const { city } = await pick.city(cities); // <- selecciona una ciudad
  const { showtimes, locations } = await cinepolis.getShowtimes(city);
  const cinemas = await cinepolis.getCinemas(locations);
  const cinemasAnswer = await pick.cinema(cinemas); // <- selecciona un cine
  const dates = cinepolis.getDates(showtimes.Cinemas, cinemasAnswer);
  const datesAnswer = await pick.date(dates.map(v => v.ShowtimeDate)); // <- selecciona una fecha

  const [{ Movies }] = dates.filter(v => v.ShowtimeDate === datesAnswer.date);
  const movies = Movies.map(v => v.Title);
  const { movie } = await pick.movie(movies); // <- selecciona una película

  const [{ Formats }] = Movies.filter(v => v.Title === movie);
  const [{ Showtimes }] = Formats;
  const showTimes = Showtimes.map(v => v.ShowtimeAMPM);
  console.log(c.cyanBright(" ·"), showTimes.join(c.cyanBright(" · "))); // <- imprime los horarios
})();

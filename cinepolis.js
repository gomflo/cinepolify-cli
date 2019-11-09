const got = require("got");

exports.getCities = async () => {
  const url =
    "https://cinepolis.com/manejadores/CiudadesComplejos.ashx?EsVIP=false";
  const { body } = await got.post(url, { json: true });
  const cities = [];

  body.map(value => {
    let city = {};
    city.message = value.Nombre;
    city.name = value.Clave;
    city.value = value.Clave;
    cities.push(city);
  });

  return cities;
};

exports.getShowtimes = async city => {
  const url = "https://cinepolis.com/Cartelera.aspx/GetNowPlayingByCity";
  const body = { claveCiudad: city, esVIP: false };
  const options = { body, json: true };
  const response = await got.post(url, options);
  const showtimes = response.body.d;
  const locations = showtimes.Locations;
  return { showtimes, locations };
};

exports.getDates = (cinemas, selectedCinema) => {
  const [cinema] = cinemas.filter(value => value.Key === selectedCinema.cinema);
  return cinema.Dates;
};

exports.getCinemas = async locations => {
  const values = Object.keys(locations);
  const cinemas = [];
  values.forEach(value => {
    let o = {};
    o.value = value;
    o.message = locations[value];
    cinemas.push(o);
  });

  return cinemas;
};

exports.getMovies = (selectedDate, dates) => {
  const [moviesArray] = dates.filter(v => v.ShowtimeDate === selectedDate);

  return movies;
};

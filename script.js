const API_KEY = "4c72e2e9f6c594693f3b9941212e4c48";

async function searchMovie() {

    const movieName =
        document.getElementById("movieInput").value;

    const url =
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieName}`;

    const response = await fetch(url);

    const data = await response.json();

    const movie = data.results[0];

    document.getElementById("movieContainer").innerHTML = `
        <h2>${movie.title}</h2>

        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">

        <p>${movie.overview}</p>

        <p>⭐ Rating: ${movie.vote_average}</p>

        <p>📅 Release Date: ${movie.release_date}</p>
    `;
}
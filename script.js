const API_KEY = "505a1e1ae7a56d5535970cdafbaacdef";

/* Search Movie */

async function searchMovie() {

    try {

        const movieName =
            document.getElementById("movieInput").value.trim();

        if (!movieName) {
            alert("Please enter a movie name");
            return;
        }

        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieName}`
        );

        const data = await response.json();

        const movie = data.results[0];

    if (!movie) {
        alert("Movie not found!");
        return;
    }

window.currentMovie = movie;

        document.getElementById("movieContainer").innerHTML = `
            <div class="movie-card">

                <img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    alt="${movie.title}"
                >

                <div class="movie-details">

                    <h2>${movie.title}</h2>

                    <p>${movie.overview}</p>

                    <p>📅 Release Date: ${movie.release_date}</p>
                    <button onclick="watchTrailer(${movie.id})">
                        🎥 Watch Trailer
                    </button>
                    <button onclick="addToFavorites(${movie.id})">
                        ⭐ Add to Favorites
                    </button>
                    <div class="stats-container">

                        <div class="stat-card">
                            ⭐ Rating
                            <h3>${movie.vote_average.toFixed(1)}</h3>
                        </div>

                        <div class="stat-card">
                            🔥 Popularity
                            <h3>${Math.round(movie.popularity)}</h3>
                        </div>

                        <div class="stat-card">
                            🗳 Votes
                            <h3>${movie.vote_count}</h3>
                        </div>

                    </div>

                </div>

            </div>
        `;

        loadRecommendations(movie.id);

    } catch (error) {

        console.error(error);
        alert("Error loading movie");

    }

}
async function showMovieDetails(movieId) {

    try {

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );

        const movie = await response.json();

        document.getElementById("movieContainer").innerHTML = `
            <div class="movie-card">

                <img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    alt="${movie.title}"
                >

                <div class="movie-details">

                    <h2>${movie.title}</h2>

                    <p>${movie.overview}</p>

                    <p>📅 Release Date: ${movie.release_date}</p>
                     <button onclick="watchTrailer(${movie.id})">
                        🎥 Watch Trailer
                    </button>
                    <button onclick="addToFavorites(${movie.id})">
                        ⭐ Add to Favorites
                    </button>
                    <div class="stats-container">

                        <div class="stat-card">
                            ⭐ Rating
                            <h3>${movie.vote_average.toFixed(1)}</h3>
                        </div>

                        <div class="stat-card">
                            🔥 Popularity
                            <h3>${Math.round(movie.popularity)}</h3>
                        </div>

                        <div class="stat-card">
                            🗳 Votes
                            <h3>${movie.vote_count}</h3>
                        </div>

                    </div>

                </div>

            </div>
        `;

        window.currentMovie = movie;

        loadRecommendations(movie.id);

        window.scrollTo({
            top: 250,
            behavior: "smooth"
        });

    } catch(error) {

        console.error(error);

    }

}
async function watchTrailer(movieId) {

    try {

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
        );

        const data = await response.json();

        const trailer = data.results.find(
            video =>
                video.site === "YouTube" &&
                video.type === "Trailer"
        );

        if (trailer) {

            window.open(
                `https://www.youtube.com/watch?v=${trailer.key}`,
                "_blank"
            );

        } else {

            alert("Trailer not available.");

        }

    } catch(error) {

        console.error(error);

    }

}

/* AI Recommendations */

async function loadRecommendations(movieId) {

    try {

        const genreId =
    window.currentMovie.genre_ids
        ? window.currentMovie.genre_ids[0]
        : window.currentMovie.genres[0].id;

const language = window.currentMovie.original_language;

const similarUrl =
`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&with_original_language=${language}&sort_by=popularity.desc`;
const response = await fetch(similarUrl);
        const data = await response.json();

        let recommendationHTML = "";

        const recommendations = data.results
    .filter(movie =>
        movie.poster_path &&
        movie.id !== window.currentMovie.id
    )
    .slice(0, 12);

        if (recommendations.length === 0) {

            document.getElementById("recommendation").innerHTML =
                "<p>No recommendations available.</p>";

            return;
        }

        recommendations.forEach(movie => {

            recommendationHTML += `
                <div class="trending-card"
     onclick="showMovieDetails(${movie.id})">

                    <img
                        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                        alt="${movie.title}"
                    >

                    <h4>${movie.title}</h4>

                </div>
            `;

        });
        document.getElementById("recommendationTitle").style.display =
"block";
        document.getElementById("recommendation").innerHTML = `
            <div class="recommendation-row">
                ${recommendationHTML}
            </div>
        `;

    } catch (error) {

        console.error("Recommendation Error:", error);

        document.getElementById("recommendation").innerHTML =
            "<p>Unable to load recommendations.</p>";
    }
}

/* Trending Movies */

async function loadTrendingMovies() {

    try {

        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
        );

        const data = await response.json();

        let html = "";

        data.results
            .filter(movie => movie.poster_path)
            .slice(0, 12)
            .forEach(movie => {

                html += `
                   <div class="trending-card"
                   onclick="showMovieDetails(${movie.id})">

                        <img
                            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                            alt="${movie.title}"
                        >

                        <h4>${movie.title}</h4>

                    </div>
                `;

            });

        document.getElementById("trendingMovies").innerHTML =
            html;

    } catch (error) {

        console.error(error);
        alert("Trending movies failed to load");

    }
    

}
function addToFavorites(movieId) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(movieId)) {

        favorites.push(movieId);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );
        loadFavorites();

        alert("Added to Favorites ⭐");

    } else {

        alert("Already in Favorites");

    }

}
async function loadFavorites() {

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    let html = "";

    for (const movieId of favorites) {

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );

        const movie = await response.json();

        html += `
            <div class="trending-card"
                 onclick="showMovieDetails(${movie.id})">

                <img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    alt="${movie.title}"
                >

                <h4>${movie.title}</h4>

<button class="remove-btn"
onclick="event.stopPropagation(); removeFromFavorites(${movie.id})">
Remove
</button>
            </div>
        `;
    }

    document.getElementById("favoritesContainer").innerHTML =
        html;
}
function removeFromFavorites(movieId) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(id => id !== movieId);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();
}
function clearFavorites() {

    localStorage.removeItem("favorites");

    loadFavorites();

}
function removeFromFavorites(movieId) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(id => id !== movieId);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();
}
loadTrendingMovies();
loadFavorites();
document
    .getElementById("movieInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {
            searchMovie();
        }

    });
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeBtn.innerHTML = "🌙 Dark Mode";
    } else {
        themeBtn.innerHTML = "☀️ Light Mode";
    }

});

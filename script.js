document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "20536129";  // Ensure this is a valid OMDb API key
    const moviesContainer = document.getElementById("movies");
    const loadMoreButton = document.getElementById("loadMore");
    const returnToTopButton = document.getElementById("returnToTop");
    const titleFilterInput = document.getElementById("titleFilter");
    const yearFilterInput = document.getElementById("yearFilter");
    const searchButton = document.getElementById("searchButton");
    const resetButton = document.getElementById("resetButton");
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popupMessage");
    const clearPopupButton = document.getElementById("clearPopupButton");
    let currentPage = 1;
    let currentTitle = "";
    let currentYear = "2024";

    async function fetchMovies(title = "", year = "", page = 1) {
        try {
            let searchTerm = title || "movie";  // Use a generic term like "movie" if no title is provided
            let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`;
            if (year) url += `&y=${encodeURIComponent(year)}`;

            console.log("Constructed URL:", url);

            const response = await fetch(url);
            const data = await response.json();

            console.log("API Response:", data);

            if (data.Response === "True") {
                if (page === 1) {
                    moviesContainer.innerHTML = "";  // Clear previous results on new search
                }
                displayMovies(data.Search);

                // Hide the load more button if there are no more results
                if (data.Search.length < 10) {  // Assuming 10 results per page
                    loadMoreButton.style.display = "none";
                } else {
                    loadMoreButton.style.display = "block";
                }
            } else {
                if (page === 1) {
                    moviesContainer.innerHTML = `<p>${data.Error}</p>`;
                }
                showPopup(data.Error);
                loadMoreButton.style.display = "none";  // Hide button if no results
            }
        } catch (error) {
            moviesContainer.innerHTML = `<p>Error fetching movies: ${error.message}</p>`;
            showPopup(`Error fetching movies: ${error.message}`);
            loadMoreButton.style.display = "none";  // Hide button on error
        }
    }

    function displayMovies(movies) {
        const movieCards = movies.map(movie => `
            <div class="movie">
                <img src="${movie.Poster}" alt="${movie.Title} poster" />
                <h3>${movie.Title}</h3>
                <h4>(${movie.Year})</h4>
            </div>
        `).join("");

        moviesContainer.innerHTML += movieCards;  // Append new results
    }

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = "block";
    }

    searchButton.addEventListener("click", () => {
        currentTitle = titleFilterInput.value.trim();
        currentYear = yearFilterInput.value.trim();
        currentPage = 1;

        fetchMovies(currentTitle, currentYear, currentPage);
    });

    resetButton.addEventListener("click", () => {
        titleFilterInput.value = "";
        yearFilterInput.value = "";
        currentTitle = "";
        currentYear = "";
        currentPage = 1;
        moviesContainer.innerHTML = ""; // Clear the movie display
        loadMoreButton.style.display = "none";  // Hide button on reset
    });

    clearPopupButton.addEventListener("click", () => {
        popup.style.display = "none";
    });

    loadMoreButton.addEventListener("click", () => {
        currentPage++;
        fetchMovies(currentTitle, currentYear, currentPage);
    });

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.onscroll = function () {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            returnToTopButton.style.display = "block";
        } else {
            returnToTopButton.style.display = "none";
        }
    };

    returnToTopButton.addEventListener("click", scrollToTop);
    /* On stat-up this is the default current year movies */
    fetchMovies(title = "", year = "2024", page = 1)
});
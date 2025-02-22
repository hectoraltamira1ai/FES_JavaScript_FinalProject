
/* Constant declarations*/
document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "20536129";
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
        const searchTerm = title || "movie";
        const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}${year ? `&y=${encodeURIComponent(year)}` : ''}`;
        
/* The following snippet is a standard try - catch for potential errors
encountered while performing a api fetch*/        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === "True") {
                if (page === 1) moviesContainer.innerHTML = "";
                displayMovies(data.Search);
                loadMoreButton.style.display = data.Search.length < 10 ? "none" : "block";
            } else {
                if (page === 1) moviesContainer.innerHTML = `<p>${data.Error}</p>`;
                showPopup(data.Error);
                loadMoreButton.style.display = "none";
            }
        } catch (error) {
            showError(error);
        }
    }
/* Display Movies is a html template which is mapped to: from the api call,
this will display the fetch results to the main html page.*/
    function displayMovies(movies) {
        const movieCards = movies.map(movie => `
            <div class="movie">
                <img src="${movie.Poster}" alt="${movie.Title} poster" loading="lazy"/>
                <h3>${movie.Title}</h3>
                <h4>(${movie.Year})</h4>
            </div>
        `).join("");
        moviesContainer.innerHTML += movieCards;
    }
/* The following 3 function are used to display errors to the user */

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = "block";
    }

    function showError(error) {
        moviesContainer.innerHTML = `<p>Error fetching movies: ${error.message}</p>`;
        showPopup(`Error fetching movies: ${error.message}`);
        loadMoreButton.style.display = "none";
    }

    searchButton.addEventListener("click", () => {
        currentTitle = titleFilterInput.value.trim();
        currentYear = yearFilterInput.value.trim();
        currentPage = 1;
        fetchMovies(currentTitle, currentYear, currentPage);
    });

/*Reset Button Event Listener
On click it emties out the fields 
and load up a default page set 
for the year 20204*/
    resetButton.addEventListener("click", () => {
        titleFilterInput.value = "";
        yearFilterInput.value = "";
        currentTitle = "";
        currentYear = "";
        currentPage = 1;
        moviesContainer.innerHTML = "";
        loadMoreButton.style.display = "none";
        fetchMovies("", "2024", 1);
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

/* Window On Scroll function display a return to top arrow
once the page is greater than 100px from the top or the document over
100px from the top*/
    window.onscroll = function () {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            returnToTopButton.style.display = "block";
        } else {
            returnToTopButton.style.display = "none";
        }
    };
/* Event Listener to detect win the "Scroll To Top" icon is pressed
then it will return to the top */
    returnToTopButton.addEventListener("click", scrollToTop);

/* This load a predetermined set of movies, so the the screen
will not look blank on startup and page refreshes.*/
    fetchMovies("", "2024", 1);
});
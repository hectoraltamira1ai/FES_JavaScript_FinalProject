/*
Variable Declarations
main one, 'moviesContainer' , 
This line selects the HTML element with the ID movies and assigns it to the constant moviesContainer. 
This element is where the movie data will be displayed on the webpage.
*/


const apiKey = '20536129';
const moviesContainer = document.getElementById('movies');
const loadMoreButton = document.getElementById('loadMore');
const sortOrderSelect = document.getElementById('sortOrder');
const returnToTopButton = document.getElementById('returnToTop');
let currentPage = 1;
let moviesList = [];

/*
Function Definitions
async fuction fetchLatestMovies
makes an api resquest to OMDb via an await fetch
The return data is captured in data via the await response.jon
try - catch - is for error handling
moviesContainer.innerHTML will display the error if any
-----
Function displayMovies(movies)
This function takes either 'asc' or 'desc' and sort the 
gathered movies in that particular order
Afterward, it uses the map function to map over the template `html template`
note the .join(''), this is to join and display all the fetched movies

*/

async function fetchLatestMovies(page = 1) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=all&type=movie&page=${page}`);
        const data = await response.json();

        if (data.Response === 'True') {
            moviesList = [...moviesList, ...data.Search];
            displayMovies(moviesList);
        } else {
            moviesContainer.innerHTML = `<p>${data.Error}</p>`;
        }
    } catch (error) {
        moviesContainer.innerHTML = `<p>Error fetching movies: ${error.message}</p>`;
    }
}

function displayMovies(movies) {
    const sortOrder = sortOrderSelect.value;
    const sortedMovies = movies.sort((a, b) => sortOrder === 'asc' ? a.Year - b.Year : b.Year - a.Year);

    const movieCards = sortedMovies.map(movie => `
        <div class="movie">
            <img src="${movie.Poster}" alt="${movie.Title} poster" />
            <h3>${movie.Title}</h3>
            <h4>(${movie.Year})</h4>
        </div>
    `).join('');

    moviesContainer.innerHTML = movieCards;
}

loadMoreButton.addEventListener('click', () => {
    currentPage++;
    fetchLatestMovies(currentPage);
});

sortOrderSelect.addEventListener('change', () => {
    displayMovies(moviesList);
});

fetchLatestMovies();

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        returnToTopButton.style.display = "block";
    } else {
        returnToTopButton.style.display = "none";
    }
};

returnToTopButton.addEventListener('click', scrollToTop);

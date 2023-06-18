"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  return res.data;
}

function imageError(image) {
  image.src = "https://tinyurl.com/tv-missing";
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
            <img src=${show.show.image.medium} onerror =imageError(this) 
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3" />
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" onclick=getEpisodesOfShow(this)>
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );
    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(btn) {
  const showId = $(btn).closest(".Show").data("show-id");
  const episodes = await axios.get(
    `http://api.tvmaze.com/shows/${showId}/episodes`
  );
  populateEpisodes(episodes.data);
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesArea.show();
  for (let episode of episodes) {
    const $episode = $(
      `
      <li class="list-group-item">${episode.name} (Season ${episode.season}, Number ${episode.number})  </li>
      `
    );
    $episodesArea.append($episode);
  }
  $("li:last-child").css("border-bottom", "black 4px solid", "margin", "10px")
  $("li:last-child").css("padding-bottom", "10px")
}

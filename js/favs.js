/**
 * Favoritos page funcionalities.
 * buttons and view gifs.
 */


// import modules
import {renderCard} from './modules/card.js';
import {darkModeButton, toggleDarkMode} from './modules/dark-mode.js';
import {renderStorage} from './modules/renderStorage.js';
import {getTrendingGifs, listenerButtons} from './modules/slider.js';

let favsGifsContainer = document.getElementById('favs-gifs');

// Listener for dark mode button
darkModeButton.addEventListener('click', toggleDarkMode);

// Listener for slider buttons imported from slider.js
listenerButtons();

// render gifos from local storage imported from render-storage.js
renderStorage('favorites', favsGifsContainer, 'fav', renderCard);

// get and render trending gifs imported from slider.js
getTrendingGifs(renderCard);
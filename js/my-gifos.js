/**
 * mis Gifos page funcionalities.
 * buttons and view gifs.
 */


// import modules
import {renderStorage} from './modules/renderStorage.js'
import {darkModeButton, toggleDarkMode} from './modules/dark-mode.js'
import {getTrendingGifs, listenerButtons} from './modules/slider.js'
import {renderCard} from './modules/card.js'

let myGifosList = document.getElementById('my-gifs-list');

// Listener for dark mode button
darkModeButton.addEventListener('click', toggleDarkMode);

// Listener for slider buttons imported from slider.js
listenerButtons();

// render gifos from local storage imported from render-storage.js
renderStorage('myGifos', myGifosList, 'myGifo', renderCard);

// get and render trending gifs imported from slider.js
getTrendingGifs(renderCard);
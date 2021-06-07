/**
 * Create card for gifs from giphos API.
 * Create cards for gifs uploaded fron device.
 * Create card to gif selected.
 */

import {renderStorage} from './renderStorage.js'

let buttonId;
let favoritesStorage = localStorage.getItem('favorites');
let buttonDeleteFavId;
let buttonsGifMax = [];
let buttonsFav = [];
let buttonsDownload = [];
let modalsGifMax = [];
let buttonsFavSvg = [];
let buttonsCloseModal = [];
let getFirstButton;
let newCard;
let favoritesGifos = [];
let body = document.body;
let cards = [];
let mobileBreakpoint = window.matchMedia('screen and (max-width: 999px)');
let modalButtons1 = [];
let buttonsDelete = [];
let buttonFavDelete;
let type;
let modalButtons1Svg = [];
let modalButtons2 = [];
let buttonDeleteHtml = `
    <button class="svg-button-card">
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
        <path d="M18 7a2.5 2.5 0 012.5 2.5l-.001.833h3.334c.425 0 .776.318.827.73l.007.104c0 .46-.373.833-.834.833H23L23 22.833a2.5 2.5 0 01-2.336 2.495l-.164.005h-8.333a2.5 2.5 0 01-2.5-2.5L9.666 12h-.833a.833.833 0 01-.827-.729L8 11.167c0-.46.373-.834.833-.834h3.333V9.5a2.5 2.5 0 012.336-2.495L14.667 7zm3.333 5h-10v10.833c0 .425.318.776.73.827l.104.007H20.5c.46 0 .833-.373.833-.834V12zm-6.666 2.5c.46 0 .833.373.833.833v5a.833.833 0 11-1.667 0v-5c0-.46.373-.833.834-.833zm3.333 0c.46 0 .833.373.833.833v5a.833.833 0 11-1.666 0v-5c0-.46.373-.833.833-.833zm0-5.833h-3.333a.833.833 0 00-.834.833v.833h5V9.5a.833.833 0 00-.728-.827L18 8.667z" id="x"/>
        </defs>
        <g fill-rule="nonzero" fill="none">
        <rect fill="#FFF" opacity=".7" width="32" height="32" rx="6"/>
        <use fill-opacity=".7" fill="#572EE5" xlink:href="#x"/>
        </g>
    </svg>
    </button>`
let buttonFavHtml = `
    <button class="svg-button-card"">
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <path d="M16.277 9.497a5.108 5.108 0 117.226 7.226l-6.947 6.947a.786.786 0 01-1.112 0l-6.947-6.947a5.11 5.11 0 017.225-7.226l.278.277.277-.277zM16 22.003l5.559-5.559.833-.833a3.537 3.537 0 10-5.003-5.003l-.833.833a.786.786 0 01-1.112 0l-.833-.833a3.538 3.538 0 00-5.003 5.003L16 22.003z" id="b"/>
        </defs>
        <g fill-rule="nonzero" fill="none">
            <rect fill="#FFF" opacity=".7" width="32" height="32" rx="6"/>
            <use fill-opacity=".7" fill="#572EE5" xlink:href="#b"/>
        </g>
        </svg>
    </button>`

/**
 * create a new card for every object in the array
 * @param {array} array - the array of gifs to be iterated
 * @param {string} container - the container to display the cards
 * @param {string} type - the type of card to be created
 */
function renderCard(array, container, type) {
    let gifs;
    let urlImage;

    if(Array.isArray(array)) {
        gifs = array;
    } else {
        gifs = array.data;
    }

    switch (type) {
        case 'trending':
            buttonId = '-trending';
            buttonFavDelete = buttonFavHtml;
            buttonDeleteFavId = 'fav-button';
            break;
        case 'search':
            buttonId = '-search';
            buttonFavDelete = buttonFavHtml;
            buttonDeleteFavId = 'fav-button';
            break;
        case 'fav':
            buttonId = '-fav';
            buttonFavDelete = buttonDeleteHtml;
            buttonDeleteFavId = 'delete-button';
            break;
        case 'myGifo':
            buttonId = '-myGifo';
            buttonFavDelete = buttonDeleteHtml;
            buttonDeleteFavId = 'delete-button';
            break;
    }

    for (let i = 0; i < gifs.length; i++) {
        if(Array.isArray(array)) {
            urlImage = gifs[i].url;
        } else {
            urlImage = gifs[i].images.original.url;
        }

        newCard = document.createElement('li');
        newCard.classList.add('trending-card');
        newCard.id = `card${buttonId}${i}`;
        newCard.innerHTML = `
        <div class="trending-img-container">
            <img src="${urlImage}" alt="${gifs[i].title}">
        </div>
        <div class="trending-card-overlay">
            <div class="trending-card-buttons">
                ${buttonFavDelete}
                <a id="download-a${buttonId}${i}">
                <button class="svg-button-card" id="download-button${buttonId}${i}">
                    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <path d="M23.5 19.333c.46 0 .833.373.833.834v2.5a2.5 2.5 0 01-2.5 2.5H10.167a2.5 2.5 0 01-2.5-2.5v-2.5a.833.833 0 111.666 0v2.5c0 .46.373.833.834.833h11.666c.46 0 .834-.373.834-.833v-2.5c0-.46.373-.834.833-.834zM16 6.833c.46 0 .833.373.833.834v9.654l1.911-1.91a.834.834 0 011.093-.075l.086.075a.833.833 0 010 1.178l-3.334 3.334a.85.85 0 01-.335.204.837.837 0 01-.843-.204l.074.066a.838.838 0 01-.064-.057l-.01-.01-3.334-3.333a.833.833 0 011.179-1.178l1.91 1.91V7.667c0-.425.319-.776.73-.827z" id="c"/>
                        </defs>
                        <g fill-rule="nonzero" fill="none">
                            <rect fill="#FFF" opacity=".7" width="32" height="32" rx="6"/>
                            <use fill-opacity=".7" fill="#572EE5" xlink:href="#c"/>
                        </g>
                    </svg>
                </button>
                </a>
                <button class="gif-max-button svg-button-card" id="gif-max-button${buttonId}${i}">
                    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <path d="M13.744 17.077a.833.833 0 011.179 1.179l-4.412 4.41H13.5c.425 0 .775.319.827.73l.006.104c0 .46-.373.833-.833.833h-5a.835.835 0 01-.59-.244l.066.06a.838.838 0 01-.054-.049l-.011-.01a.85.85 0 01-.139-.183.83.83 0 01-.105-.407v-5a.833.833 0 111.666 0v2.989zm9.756-9.41a.838.838 0 01.59.244l-.06-.055a.838.838 0 01.046.042l.013.013a.85.85 0 01.186.282.83.83 0 01.058.307v5a.833.833 0 11-1.666 0v-2.99l-4.411 4.413a.834.834 0 01-1.093.074l-.086-.074a.833.833 0 010-1.179l4.412-4.411H18.5a.833.833 0 01-.827-.728l-.006-.105c0-.46.373-.833.833-.833z" id="a"/>
                        </defs>
                        <g fill-rule="nonzero" fill="none">
                            <rect fill="#FFF" opacity=".7" width="32" height="32" rx="6"/>
                            <use fill-opacity=".7" fill="#572EE5" xlink:href="#a"/>
                        </g>
                    </svg>
                </button>
            </div>
            <div>
                <p>${gifs[i].username}</p>
                <p>${gifs[i].title}</p>
            </div>      
        </div>
        <div class="gif-max-modal" id="gif-max-modal${buttonId}${i}"></div>`

        container.appendChild(newCard);
        getFirstButton = document.querySelector(`#card${buttonId}${i} .svg-button-card:first-of-type`);
        getFirstButton.setAttribute('id', `${buttonDeleteFavId}${buttonId}${i}`);
        listenCardButtons('click', buttonsGifMax, i, `gif-max-button${buttonId}`, openModal, gifs, buttonId, urlImage);
        listenCardButtons('mouseenter',buttonsDownload, i, `download-button${buttonId}`, activateDownload, gifs, buttonId, urlImage);
        cards[i] = document.querySelector(`#card${buttonId}${i} .trending-img-container`);
        responsiveCard(mobileBreakpoint, cards[i], openModal, i, gifs, buttonId, urlImage);
        mobileBreakpoint.addEventListener('change', () => {
            responsiveCard(mobileBreakpoint, cards[i], openModal, i, gifs, buttonId, urlImage)
        });

        if(type === 'trending' || type === 'search') {
            listenCardButtons('click',buttonsFav, i, `${buttonDeleteFavId}${buttonId}`, toggleFavorite, gifs, buttonId)
            renderHeartActive(i, gifs, type)
        } else if (type === 'fav') {
            listenCardButtons('click', buttonsDelete, i, `${buttonDeleteFavId}${buttonId}`, removeGif, gifs, buttonId)
        } else {
            listenCardButtons('click', buttonsDelete, i, `${buttonDeleteFavId}${buttonId}`, removeGif, gifs, buttonId)
        }
    }
}

/**
 * get and listen buttons of cards
 * @param {string} e - the type of event 
 * @param {array} buttons - the array of HTML nodes
 * @param {number} index - the position in the array
 * @param {string} id - the prefix of the id for the button
 * @param {callback} callback - the function to be executed
 * @param {array} data - the array of gifs
 * @param {string} buttonId - the specific id for the type of card
 * @param {string} url - the url of the gif image
 */
function listenCardButtons(e, buttons, index, id, callback, data, buttonId, url) {
    buttons[index] = document.getElementById(`${id}${index}`);
    buttons[index].addEventListener(e, () => {
        callback(index, data, buttonId, url);
    })
};

/**
 * add or remove of favorites by checking in local storage if it's already saved
 * @param {number} index - the position in the array
 * @param {array} gifs - the array of gifs
 * @param {string} buttonId - the specific id for the type of card
 */
function toggleFavorite(index, gifs, buttonId) {
    favoritesStorage = localStorage.getItem('favorites');
    if(JSON.parse(favoritesStorage) === null) {
        addFavorite(index, gifs, buttonId);
    } else if(JSON.parse(favoritesStorage).some((gif) => gif.id === gifs[index].id)) {
        removeFavorite(index, gifs, buttonId);
    } else {
        addFavorite(index, gifs, buttonId);
    }

    if(window.location.pathname === '/favoritos.html') {
        let gifsList = document.getElementById('favs-gifs');
        gifsList.innerHTML = '';
        renderStorage('favorites', gifsList, 'fav', renderCard);
    }
};

/**
 * add new favorite by pushing an object to an array, if the storage already
 * have something saved, concat the data from the array and the local storage value
 * @param {number} index - the position in the array
 * @param {array} gifs - the array of gifs
 * @param {string} buttonId - the specific id for the type of card
 */
function addFavorite(index, gifs, buttonId) {
    let urlImage
    if(Object.keys(gifs[index]).length < 4) {
        urlImage = gifs[index].url;
    } else {
        urlImage = gifs[index].images.original.url;
    }

    favoritesGifos.push({
        id: gifs[index].id, 
        title: gifs[index].title, 
        username: gifs[index].username,
        url: urlImage
    })

    if(JSON.parse(favoritesStorage) !== null) {
        favoritesGifos.splice(0, favoritesGifos.length - 1);
        favoritesGifos = favoritesGifos.concat(JSON.parse(favoritesStorage));
        localStorage.setItem('favorites', JSON.stringify(favoritesGifos));

        if(buttonId ==='-trending') {
            type = 'trending';
        } else {
            type = 'search';
        }

        favoriteHeartActive(index, type);

    } else {
        localStorage.setItem('favorites', JSON.stringify(favoritesGifos))
        if(buttonId ==='-trending') {
            type = 'trending';
        } else {
            type = 'search';
        }
        favoriteHeartActive(index, type);
    }
};

/**
 * remove favorite by finding the matching id and splice the local storage array
 * @param {number} index - the position in the array
 * @param {array} gifs - the array of gifs
 * @param {string} buttonId - the specific id for the type of card
 */
function removeFavorite(index, gifs, buttonId) {
    let gifIndex = JSON.parse(favoritesStorage).findIndex(gif => gif.id === gifs[index].id);
    favoritesGifos = JSON.parse(favoritesStorage);
    favoritesGifos.splice(gifIndex, 1);
    localStorage.setItem('favorites', JSON.stringify(favoritesGifos));
    let type = buttonId === '-trending' ? 'trending' : 'search';
    favoriteHeartDisable(index, type);
};

/**
 * remove gif of favorites or my gifos
 * @param {number} index - the position in the array
 * @param {array} gifs - the array of gifs
 * @param {string} buttonId - the specific id for the type of card
 */
function removeGif(index, gifs, buttonId) {
    let storage = buttonId === '-fav' ? localStorage.getItem('favorites') : localStorage.getItem('myGifos');
    let storageParse = JSON.parse(storage);
    let gifIndex = storageParse.findIndex(gif => gif.id === gifs[index].id);
    storageParse.splice(gifIndex, 1);

    if(buttonId === '-fav') { 
        let gifsList = document.getElementById('favs-gifs');
        localStorage.setItem('favorites', JSON.stringify(storageParse));
        gifsList.innerHTML = '';
        renderStorage('favorites', gifsList, 'fav', renderCard);
    } else {
        let gifsList = document.getElementById('my-gifs-list');
        localStorage.setItem('myGifos', JSON.stringify(storageParse));
        gifsList.innerHTML = '';
        renderStorage('myGifos', gifsList, 'myGifo', renderCard);
    }
};

/**
 * render filled heart without event by cheching data from local storage
 * @param {number} index - the position in the array
 * @param {array} gifs - the array of gifs
 * @param {string} type - the type of card
 */
function renderHeartActive(index, gifs, type) {
    let favorites = JSON.parse(favoritesStorage);
    if(favorites) {
        for (let i = 0; i < favorites.length; i++) {
            if(favorites[i].id === gifs[index].id) {
                if(buttonId ==='-trending') {
                    type = 'trending';
                } else {
                    type = 'search';
                }
                favoriteHeartActive(index, type);
            }   
        }
    }
};

/**
 * fill the favorite heart in card and modal
 * @param {number} index - the position in the array
 * @param {string} type - the type of card
 */
function favoriteHeartActive(index, type) {
    if(type === 'trending') {
        buttonDeleteFavId = 'fav-button';
        buttonId = '-trending';
    } else {
        buttonDeleteFavId = 'fav-button';
        buttonId = '-search';
    }

    buttonsFavSvg[index] = document.querySelector(`#${buttonDeleteFavId}${buttonId}${index} svg`);
    buttonsFavSvg[index].innerHTML = `
        <g data-name="00-UI-Kit">
            <rect width="32" height="32" rx="6" ry="6" style="isolation:isolate" fill="#fff" opacity=".7"/>
            <path d="M16.28 9.5a5.11 5.11 0 117.22 7.22l-6.94 7a.79.79 0 01-1.12 0l-6.94-7a5.11 5.11 0 017.22-7.22l.28.27z" fill="#572EE5" fill-opacity=".7"/>
        </g>`

    let modalContainer = document.getElementById(`gif-max-modal${buttonId}${index}`);
    if(modalContainer.hasChildNodes()) {  
        modalButtons1Svg[index].innerHTML = `
        <g data-name="00-UI-Kit">
            <rect width="32" height="32" rx="6" ry="6" style="isolation:isolate" fill="#fff" opacity=".7"/>
            <path d="M16.28 9.5a5.11 5.11 0 117.22 7.22l-6.94 7a.79.79 0 01-1.12 0l-6.94-7a5.11 5.11 0 017.22-7.22l.28.27z" fill="#572EE5" fill-opacity=".7"/>
        </g>`
    }
};

/**
 * render a stroke heart in card and modal
 * @param {number} index - the position in the array
 * @param {string} type - the type of card
 */
function favoriteHeartDisable(index, type) {
    if(type === 'trending') {
        buttonDeleteFavId = 'fav-button';
        buttonId = '-trending';
    } else {
        buttonDeleteFavId = 'fav-button';
        buttonId = '-search';
    }

    buttonsFavSvg[index] = document.querySelector(`#fav-button${buttonId}${index} svg`);
    buttonsFavSvg[index].innerHTML = `
        <defs>
            <path d="M16.277 9.497a5.108 5.108 0 117.226 7.226l-6.947 6.947a.786.786 0 01-1.112 0l-6.947-6.947a5.11 5.11 0 017.225-7.226l.278.277.277-.277zM16 22.003l5.559-5.559.833-.833a3.537 3.537 0 10-5.003-5.003l-.833.833a.786.786 0 01-1.112 0l-.833-.833a3.538 3.538 0 00-5.003 5.003L16 22.003z" id="b"/>
        </defs>
        <g fill-rule="nonzero" fill="none">
            <rect fill="#FFF" opacity=".7" width="32" height="32" rx="6"/>
            <use fill-opacity=".7" fill="#572EE5" xlink:href="#b"/>
        </g>`

    let modalContainer = document.getElementById(`gif-max-modal${buttonId}${index}`);
    if(modalContainer.hasChildNodes()) {  
        modalButtons1Svg[index].innerHTML = `
        <defs>
            <path d="M16.277 9.497a5.108 5.108 0 117.226 7.226l-6.947 6.947a.786.786 0 01-1.112 0l-6.947-6.947a5.11 5.11 0 017.225-7.226l.278.277.277-.277zM16 22.003l5.559-5.559.833-.833a3.537 3.537 0 10-5.003-5.003l-.833.833a.786.786 0 01-1.112 0l-.833-.833a3.538 3.538 0 00-5.003 5.003L16 22.003z" id="b"/>
        </defs>
        <g fill-rule="nonzero" fill="none">
            <rect fill="#FFF" opacity=".7" width="32" height="32" rx="6"/>
            <use fill-opacity=".7" fill="#572EE5" xlink:href="#b"/>
        </g>`
    }
};

/**
 * API request to generate a blob and create a local url to download gif
 * @param {number} index - the position in the array
 * @param {array} gifs - the array of gifs
 * @param {string} buttonId - the id for specific type of card
 * @param {string} url - the url to make the request
 */
async function activateDownload(index, gifs, buttonId, url) {
    let downloadAnchor;
    let modalContainer = document.getElementById(`gif-max-modal${buttonId}${index}`);
    if(modalContainer.hasChildNodes()) {
        downloadAnchor = document.getElementById(`download-a-max-gif${buttonId}${index}`);
    } else {
        downloadAnchor = document.getElementById(`download-a${buttonId}${index}`);
    }
    
    if(!downloadAnchor.hasAttribute('href')) {
        let response = await fetch(url);
        let imageBlob = await response.blob();
        let urlBlob = URL.createObjectURL(imageBlob);
        downloadAnchor.href = urlBlob;
        downloadAnchor.download = `${gifs[index].title}.gif`;
    }
};

/**
 * maximize a gif by creating modal window element
 * @param {number} index - the position in the array
 * @param {array} gifs - the array of gifs
 * @param {string} buttonId - the id for specific type of card
 * @param {string} url - the url of the gif image
 */
function openModal(index, gifs, buttonId, url) {
    let urlImage
    if(buttonId === '-trending' || buttonId === '-search') {
        buttonDeleteFavId = 'max-gif-modal-heart'; 
    } else if (buttonId === '-fav' || buttonId === '-myGifo') {
        buttonDeleteFavId = 'max-gif-modal-delete';
    }

    if(Object.keys(gifs[index]).length <= 4) {
        urlImage = gifs[index].url;
        buttonFavDelete = buttonDeleteHtml;
    } else {
        urlImage = gifs[index].images.original.url;
        buttonFavDelete = buttonFavHtml;
    }

    modalsGifMax[index] = document.getElementById(`gif-max-modal${buttonId}${index}`);
    modalsGifMax[index].innerHTML = `
        <button class="close-modal" id="close-modal-button${buttonId}${index}">
            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <path d="M.293.293a1 1 0 011.414 0L7 5.585 12.293.293a1 1 0 011.32-.083l.094.083a1 1 0 010 1.414L8.415 7l5.292 5.293a1 1 0 01.083 1.32l-.083.094a1 1 0 01-1.414 0L7 8.415l-5.293 5.292a1 1 0 01-1.32.083l-.094-.083a1 1 0 010-1.414L5.585 7 .293 1.707A1 1 0 01.21.387z" id="d"/>
                </defs>
                <use fill="#4A1EE3" fill-rule="nonzero" xlink:href="#d"/>
            </svg>
        </button>
        <div class="gif-max-img">
            <div class="modal-img-footer">
                <img src="${urlImage}" class="gif" alt="${gifs[index].title}">
                    <div class="footer-modal">
                    <div class="info-modal">
                        <p>${gifs[index].username}</p>
                        <p>${gifs[index].title}</p>
                    </div>
                    <div class="buttons-modal">
                        ${buttonFavDelete}
                        <a id="download-a-max-gif${buttonId}${index}">
                        <button class="svg-button-card" id="download-button${buttonId}${index}">
                            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <defs>
                                    <path d="M23.5 19.333c.46 0 .833.373.833.834v2.5a2.5 2.5 0 01-2.5 2.5H10.167a2.5 2.5 0 01-2.5-2.5v-2.5a.833.833 0 111.666 0v2.5c0 .46.373.833.834.833h11.666c.46 0 .834-.373.834-.833v-2.5c0-.46.373-.834.833-.834zM16 6.833c.46 0 .833.373.833.834v9.654l1.911-1.91a.834.834 0 011.093-.075l.086.075a.833.833 0 010 1.178l-3.334 3.334a.85.85 0 01-.335.204.837.837 0 01-.843-.204l.074.066a.838.838 0 01-.064-.057l-.01-.01-3.334-3.333a.833.833 0 011.179-1.178l1.91 1.91V7.667c0-.425.319-.776.73-.827z" id="c"/>
                                </defs>
                                <g fill-rule="nonzero" fill="none">
                                    <rect fill="#FFF" opacity=".7" width="32" height="32" rx="6"/>
                                    <use fill-opacity=".7" fill="#572EE5" xlink:href="#c"/>
                                </g>
                            </svg>
                        </button>
                        </a>
                    </div>                        
                </div>
            </div> 
        </div>`

    modalsGifMax[index].classList.add('gif-max-show');
    setTimeout(() => {
        modalsGifMax[index].classList.add('gif-max-transition')
    }, 100);
    buttonsCloseModal[index] = document.getElementById(`close-modal-button${buttonId}${index}`);
    buttonsCloseModal[index].addEventListener('click', () => {
        closeModal(index, modalsGifMax);
    })
    body.addEventListener('keydown', (e) => {
        if(e.key === "Escape") {
            closeModal(index, modalsGifMax); 
        }
    })
    
    modalButtons1[index] = document.querySelector(`#gif-max-modal${buttonId}${index} .buttons-modal .svg-button-card:first-of-type`);
    modalButtons1[index].id = `${buttonDeleteFavId}${buttonId}${index}`;
    modalButtons1Svg[index] = document.querySelector(`#gif-max-modal${buttonId}${index} .buttons-modal .svg-button-card:first-of-type svg`);
    modalButtons2[index] = document.getElementById(`download-a-max-gif${buttonId}${index}`);
    activateDownload(index, gifs, buttonId, url);
    
    if(buttonId === '-trending' || buttonId === '-search') {
        favoritesStorage = localStorage.getItem('favorites');
        let favorites = JSON.parse(favoritesStorage);
        if(favorites) {
            for (let i = 0; i < favorites.length; i++) {
                if(favorites[i].id === gifs[index].id) {
                    modalButtons1Svg[index].innerHTML = `
                    <g data-name="00-UI-Kit">
                        <rect width="32" height="32" rx="6" ry="6" style="isolation:isolate" fill="#fff" opacity=".7"/>
                        <path d="M16.28 9.5a5.11 5.11 0 117.22 7.22l-6.94 7a.79.79 0 01-1.12 0l-6.94-7a5.11 5.11 0 017.22-7.22l.28.27z" fill="#572EE5" fill-opacity=".7"/>
                    </g>`
                }   
            }
        }

        modalButtons1[index].addEventListener('click', () => {
            toggleFavorite(index, gifs, buttonId);
        })
    } else {
        modalButtons1[index].addEventListener('click', () => {
            removeGif(index, gifs, buttonId);
        })
    }
};

/**
 * close modal window by its deleting content
 * @param {number} i - the position in the array
 * @param {string} modal - the array of modal elements
 */
function closeModal(i, modal) {
    modal[i].innerHTML = '';
    modal[i].classList.remove('gif-max-show');
    modal[i].classList.remove('gif-max-transition');
}

/**
 * add event of card for mobile
 * @param {object} breakpoint - the media query to match
 * @param {string} card - the card for the event
 * @param {callback} callback - the function to execute
 * @param {number} index - the position in the array
 * @param {array} gifs - the array of gifs
 * @param {string} buttonId - the specific id for type of card
 * @param {string} url - the url of the gif image
 */
function responsiveCard(breakpoint, card, callback, index, gifs, buttonId, url) {
    if(Object.keys(gifs[index]).length <= 4) {
        url = gifs[index].url;
    } else {
        url = gifs[index].images.original.url;
    }
    if(breakpoint.matches) {
        card.addEventListener('click', () => {
            callback(index, gifs, buttonId, url);
        })
    }
};

export {renderCard}
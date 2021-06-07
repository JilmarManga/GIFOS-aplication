/**
 * Save information and preferences in local and session storage.
 */

let paginationNumber;
let paginationNumbers = [];
let gifsStorage;
let paginationArr;
let paginationCount; 
let offset = 0;

/**
 * check if a key from local storage has value. When is true execute renderCard
 * to render all favorites gifos or my gifos. 
 * @param {string} key - the name of the key in the localStorage
 * @param {string} container - the HTML node to render the gifs from localStorage
 * @param {string} type - the type of card to render
 * @param {callback} callback - the function to render cards, renderCard from card.js
 */
function renderStorage (key, container, type, callback) {
    gifsStorage = JSON.parse(localStorage.getItem(key));

    if(gifsStorage === null || gifsStorage.length < 1) {
        container.classList.add('no-favs-container')
        if(type === 'fav') {
            container.innerHTML = `
            <img class="no-favs-img" src="./img/icon-fav-sin-contenido.svg">
            <p class="no-favs">¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!</p>`
        } else {
            container.innerHTML = `
            <img class="no-favs-img" src="img/icon-mis-gifos-sin-contenido.svg">
            <p class="no-favs">¡Anímate a crear tu primer GIFO!</p>`
        }
    } else {
        paginationCount = Number.isInteger(gifsStorage.length / 12) ? gifsStorage.length / 12 : Math.floor(gifsStorage.length / 12) + 1;
        if(gifsStorage.length > 12) {
            pagination(gifsStorage, container, type, callback);
            splitStorage(offset);
            callback(gifsStorage, container, type);
        } else {
            callback(gifsStorage, container, type);
        }
        container.classList.remove('no-favs-container');
    }
};

/**
 * generate new array from localStorage with 12 positions
 * @param {number} offset - the offset value the start the new array
 * @returns a new array with 12 positions 
 */
function splitStorage(offset) {
        paginationArr = gifsStorage.slice(offset, 12 + offset);
        return gifsStorage = paginationArr;
}

/**
 * render pagination element and add listener to buttons
 * @param {array} storage - the array from localStorage
 * @param {string} container - the HTML node to render the paginationn
 * @param {string} type - the type of card to render
 * @param {callback} callback - the function to execute , renderCard from card.js
 */
function pagination(storage, container, type, callback) {
    let paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = `
    <div id="fav-pagination" class="pagination">
        <button id="pagination-left" class="pagination-button">
            <svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" width="2.87mm" height="4.92mm" viewBox="0 0 8.12 13.94">
                <defs>
                </defs>
                <g id="button-right"><path id="path-1" class="cls-1" d="M7.71,1.72a1,1,0,0,0,0-1.41,1,1,0,0,0-1.42,0l-6,6a1,1,0,0,0,0,1.41l6,6a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41L2.41,7Z"/></g>
            </svg>
        </button>
        <div class="pagination-container">
            <ol id="pagination-list" class="pagination-list"></ol>
        </div>
        <button id="pagination-right" class="pagination-button">
            <svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" width="2.87mm" height="4.92mm" viewBox="0 0 8.12 13.94">
                <defs>
                </defs>
                <g id="button-right"><path id="path-1" class="cls-1" d="M5.59,7l-5.3,5.3a1,1,0,0,0,0,1.41,1,1,0,0,0,1.42,0l6-6a1,1,0,0,0,0-1.41l-6-6A1,1,0,0,0,.29.31a1,1,0,0,0,0,1.41Z"/></g>
            </svg>
        </button>
    </div>`
    let paginationList = document.getElementById('pagination-list');
    paginationList.style.gridTemplateColumns = `repeat(${paginationCount}, 58px)`;
    let leftSlider = document.getElementById('pagination-left');
    leftSlider.classList.add('pagination-button-disabled');
    let rightSlider = document.getElementById('pagination-right');
    paginationSlider(leftSlider, rightSlider, paginationList, pagination);
    
    for (let i = 0; i < paginationCount; i++) {
        paginationNumber = document.createElement('li');
        paginationNumber.classList.add('pagination-number');
        paginationNumber.setAttribute('id', `pagination-number${i+1}`);
        paginationNumber.innerHTML = i+1;
        paginationList.appendChild(paginationNumber);
        paginationNumbers[i] = document.getElementById(`pagination-number${i+1}`);
        paginationNumbers[0].classList.add('pagination-number-active');
        paginationNumbers[i].addEventListener('click', () => {
            paginationButton(i, storage, container, type, callback);
        })        
    }
};

/**
 * when clicking on a button render new cards from the data from localStorage
 * @param {number} index - the position in the array
 * @param {array} storage - the array from localStorage
 * @param {string} container - the HTML node to render the cards
 * @param {string} type - the type of card to render
 * @param {callback} callback - the function to execute, renderCard from card.js
 */
function paginationButton(index, storage, container, type, callback) {
    storage = type === 'fav' ? JSON.parse(localStorage.getItem('favorites')) : JSON.parse(localStorage.getItem('myGifos'));
    window.scroll(0, 0);
    offset = index * 12;
    let numberActive = document.querySelector('.pagination-number-active');
    numberActive.classList.remove('pagination-number-active');
    paginationNumbers[index].classList.add('pagination-number-active');
    container.innerHTML = '';
    paginationArr = storage.slice(offset, 12 + offset);
    storage = paginationArr;
    callback(storage, container, type);
};

/**
 * listener for left and right button
 * @param {string} leftBtn - the HTML node corresponding the left button of pagination
 * @param {string} rightBtn - the HTML node corresponding the right button of pagination
 * @param {string} element - the HTML node to change style
 */
function paginationSlider(leftBtn, rightBtn, element) {
    let right = 0;
    rightBtn.addEventListener('click', () => {
        if(right <= paginationCount * 58 - 280) {
            right += 290;
            leftBtn.classList.remove('pagination-button-disabled');

            if(right > paginationCount * 58 - 290) {
                rightBtn.classList.add('pagination-button-disabled');
            }

            element.style.right = `${right}px`;
        }          
    })

    leftBtn.addEventListener('click', () => {        
        if(right > 0) {
            right -= 290;
            element.style.right = `${right}px`;
            rightBtn.classList.remove('pagination-button-disabled');

            if(right === 0) {
                console.log('desahanilita boton');
                leftBtn.classList.add('pagination-button-disabled');

            }
        }
    })
};

export {renderStorage}
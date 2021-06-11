// import modules
import {darkModeButton, toggleDarkMode} from './modules/dark-mode.js'
import {renderCard} from './modules/card.js'
import {getTrendingGifs, listenerButtons} from './modules/slider.js'

let apiKey = 'aN6tuDgSQKVjGDlrpnbycWZMk51kvdtQ';
let offset = 0;
let desktopBreakpoint = window.matchMedia('screen and (min-width: 1000px)');
let trendingWords = document.getElementById('trending-words');
let resultsContainer;
let searchInput = document.getElementById('searchInput');
let suggestionsList = document.getElementById('suggestions-list');
let searchForm = document.querySelector('.search-block form');
let searchButtonMain = document.getElementById('search-icon-main');
let searchButtonHeader = document.getElementById('search-icon-header');
let clearButton = document.getElementById('clear-button');
let suggestionItem = [];
let resultsSearchSection = document.querySelector('.results-search');
let paginationContainer = document.getElementById('pagination-container');
let paginationNumbers = [];


// Listener for dark mode button
darkModeButton.addEventListener('click', toggleDarkMode);


// API request to get trending words and invoke function to render data
async function getTrendingWords() {  
    let response = await fetch(`https://api.giphy.com/v1/trending/searches?api_key=${apiKey}`)
    let words = await response.json()
    renderTrendingWords(words)
}

getTrendingWords()

/**
 * render trending words and add them a listener for search
 * @param {object} array - response from server containing the array with the trending words
 */
function renderTrendingWords(array) {
    let words = array.data.slice(0, 5)
    let newWord
    let wordsEvent

    for (let i = 0; i < words.length; i++) {
        if(i === words.length - 1) {
            newWord = document.createElement('span')
            newWord.innerHTML = `${words[i]}`
            trendingWords.appendChild(newWord)
        } else {
            newWord = document.createElement('span')
            newWord.innerHTML = `${words[i]}, `
            trendingWords.appendChild(newWord)
        }
            
        wordsEvent = document.querySelector(`#trending-words span:nth-of-type(${i+1})`)
        wordsEvent.addEventListener('click', () => {
            offset = 0
            searchInput.value = words[i]
            getSearchResults(words[i], offset)
            responsiveScroll(desktopBreakpoint)
        })
    }
}


// get and render trending gifs imported from slider.js
getTrendingGifs(renderCard);

// Listener for slider buttons imported from slider.js
listenerButtons();

/**
 * request search suggestions from user input and invoke a function to render them
 * @param {string} input - the term to get suggestions from
 */
function getSearchSuggestions(input) {
    fetch(`https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${input}`)
        .then(response => response.json())
        .then(response => {
            renderSearchSuggestions(response)
        })
};

// listener for search input on key up
searchInput.addEventListener('keyup', () => {
    let term = searchInput.value
    if(term) {
        getSearchSuggestions(term);
        inputActive(searchButtonMain);
    } else {
        setTimeout(() => {
            suggestionsList.innerHTML = ''
        }, 400);
        inputNormal(searchButtonMain);
        inputNormal(searchButtonHeader);
        searchForm.classList.remove('suggestions');
    }          
});

/**
 *  modify icons of input when it's active
 * @param {string} button - the HTML node to modify
 */
function inputActive(button) {
    button.classList.add('input-active-icon');
    clearButton.classList.remove('hidden');
    clearButton.addEventListener('click', () => {
    });
};

/**
 * remove class of active input
 * @param {string} button - the HTML node to remove class of
 */
function inputNormal(button) {
    button.classList.remove('input-active-icon');
    clearButton.classList.add('hidden');
};

// listener for search input on focus
searchInput.addEventListener('focus', () => {
    if(searchInput.value) {
        getSearchSuggestions(searchInput.value) ;
        setTimeout(() => {
            searchForm.classList.add('suggestions')    
        }, 300);
        inputActive(searchButtonMain);
        // inputActive(searchButtonHeader)   revisar borrar
    }
});

// listener for search input on focus out
searchInput.addEventListener('focusout', () => {
    setTimeout(() => {
        suggestionsList.innerHTML = ''  
        inputNormal(searchButtonMain);
        // inputNormal(searchButtonHeader)  revisar borrar
    }, 300);
    searchForm.classList.remove('suggestions');
});

/**
 * insert suggestions
 * @param {object} array - response from server containing the array with the search suggestions
 */
function renderSearchSuggestions(array) {
    let terms = array.data.slice(0, 4);
    let listItem;

    for (let i = 0; i < terms.length; i++) {
        listItem = document.createElement('li');
        listItem.classList.add('suggestion-item');
        listItem.setAttribute('id', `suggestionItem${i}`);
        listItem.innerHTML = `
        <button id="suggestion-item-button${i}">
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <path d="M8.5 0a8.5 8.5 0 016.677 13.761l4.53 4.532a1 1 0 01-1.414 1.414l-4.532-4.53A8.5 8.5 0 118.5 0zm0 2a6.5 6.5 0 104.548 11.144l.045-.051c.016-.016.033-.032.05-.046A6.5 6.5 0 008.5 2z" id="w"/>
                </defs>
                <use fill="#9CAFC3" fill-rule="nonzero" xlink:href="#w"/>
            </svg>
        </button>
        <p>${terms[i].name}</p>`
            
        if(suggestionsList.childElementCount < 4) {
            suggestionsList.appendChild(listItem);
        } else {
            suggestionsList.replaceChild(listItem, suggestionsList.children[i]);
        }

        suggestionItem[i] = document.getElementById(`suggestionItem${i}`);
        suggestionItem[i].addEventListener('click', (e) => {
            let term = terms[i].name;
            searchInput.value = term;
            searchInputNav.value = term;
            getSearchResults(term, 0);
            responsiveScroll(desktopBreakpoint);
        })
    };

    searchForm.classList.add('suggestions');
}

/**
 * get search results and call render functions depending on the scenario
 * @param {string} input - the user input to get search results from
 * @param {number} offset - the offset value
 */
function getSearchResults(input, offset) {
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${input}&limit=12&offset=${offset}&rating=g`)
        .then(response => response.json())
        .then(response => {
            if(resultsContainer !== undefined & offset >= 12) {
                renderSearchPagination(response, input);
            } else if(response.data.length > 0) {
                renderSearchResults(response, input);    
            } else {
                renderNoResults(input);
            }      
        })
};

// function to get search results from input of another page imported from nav-search.js
// navSearch(getSearchResults, offset)

/**
 * render search results and add pagination
 * invoke renderCard from card.js
 * @param {object} array - response from server containing the array with the search results 
 * @param {string} input - the user input
 */
function renderSearchResults(array, input) {
    resultsSearchSection.innerHTML = `
        <h2 id="search-word">${input}</h2>
        <ul class="results-container grid-gifs"></ul>`   
    resultsSearchSection.classList.add('gifs-container'); 
    resultsContainer = document.querySelector('.results-container');
    paginationContainer.innerHTML = `<div id="search-pagination" class="pagination"></div>`;
    paginationContainer.classList.add('margin-botton');
    let searchPagination = document.getElementById('search-pagination');
    renderCard(array, resultsContainer, 'search');
    pagination(searchPagination, array, input);
};

/**
 * render search results when pagination is already added
 * invoke renderCard from card.js
 * @param {object} array - response from server containing the array with the search results 
 * @param {string} input - the user input
 */
function renderSearchPagination(array, input) {
    resultsSearchSection.innerHTML = `
        <h2 id="search-word">${input}</h2>
        <ul class="results-container grid-gifs"></ul>` 
    resultsContainer = document.querySelector('.results-container');
    renderCard(array, resultsContainer, 'search');
};

/**
 * create pagination element and add listener to numbers, invoke a new search when clicking
 * on a number
 * @param {string} element - the HTML node to render the pagination
 * @param {object} array - response from server containing the total count of gifs to calculate pagination
 * @param {string} input - the user input for search
 */
function pagination(element, array, input) {
    let paginationList;
    let pagination = Math.floor(array.pagination.total_count / 12 + 1);
    let paginationNumber;
    let rightSlider;
    let leftSlider;
    element.innerHTML = `
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
        </button>`

    paginationList = document.getElementById('pagination-list');
    paginationList.style.gridTemplateColumns = `repeat(${pagination}, 58px)`;
    leftSlider = document.getElementById('pagination-left');
    leftSlider.classList.add('pagination-button-disabled');
    rightSlider = document.getElementById('pagination-right');
    paginationSlider(leftSlider, rightSlider, paginationList, pagination);
        
    for (let i = 0; i < pagination; i++) {
        paginationNumber = document.createElement('li');
        paginationNumber.classList.add('pagination-number');
        paginationNumber.setAttribute('id', `pagination-number${i+1}`);
        paginationNumber.innerHTML = i+1;
        paginationList.appendChild(paginationNumber);
        paginationNumbers[i] = document.getElementById(`pagination-number${i+1}`);
        paginationNumbers[0].classList.add('pagination-number-active');
        paginationNumbers[i].addEventListener('click', () => {
            let numberActive = document.querySelector('.pagination-number-active');
            numberActive.classList.remove('pagination-number-active');
            paginationNumbers[i].classList.add('pagination-number-active');
            paginationSearch(i, input, offset, paginationNumbers);
        })
    }
};

/**
 * request new search results based on the number pressed
 * @param {number} i - the position in the array of pagination
 * @param {string} input - the user input for search
 * @param {number} offset - the offset value to make the new request
 */
function paginationSearch(i, input, offset) {
    offset = i * 12;
    responsiveScroll(desktopBreakpoint);
    getSearchResults(input, offset);
};

/**
 * add listeners to buttons of pagination element
 * @param {string} leftBtn - the HTML node corresponding the left button of pagination
 * @param {string} rightBtn - the HTML node corresponding the right button of pagination
 * @param {string} element - the HTML node to change style
 * @param {number} pagination - the amount of numbers
 */
function paginationSlider(leftBtn, rightBtn, element, pagination) {
    let right = 0
    rightBtn.addEventListener('click', () => {
        if(right <= pagination * 58 - 280) {
            right += 290;
            leftBtn.classList.remove('pagination-button-disabled');

            if(right > pagination * 58 - 290) {
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

/**
 * add listeners to inputs to get search results
 * @param {string} inputElement - the input element to get value from
 * @param {string} form - the form to listen
 */
function search(inputElement, form) {
    let input
    form.addEventListener('submit', (e) => {
        offset = 0;
        e.preventDefault();
        input = inputElement.value;
        inputElement.blur();

        if(input !== "") {
            getSearchResults(input, offset);
            responsiveScroll(desktopBreakpoint);
            if(e.path.length === 7) {
                // searchInputNav.value = input;
            } else {
                searchInput.value = input;
            }
        }  
    })
};

search(searchInput, searchForm);

/**
 * render error message when no gifs were found
 * @param {string} input - the user input
 */
function renderNoResults(input) {
    let paginationElement = document.getElementById('search-pagination');
    resultsSearchSection.innerHTML = `
    <h2 id="search-word">${input}</h2>
    <img class="no-results" src="./img/icon-busqueda-sin-resultado.svg">
    <p class="no-results-text">Intenta con otra busqueda</p>`

    if(paginationElement) {
        paginationElement.innerHTML = '';
    }  
};

/**
 * correct scroll of search results for different devices
 * @param {object} breakpoint - the media query to match 
 */
function responsiveScroll(breakpoint) {    
    if (breakpoint.matches) {
        window.scrollTo (0, 565);
    } else {
        window.scrollTo(0, 510);
    }
};
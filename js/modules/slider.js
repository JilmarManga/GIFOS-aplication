/**
 * slider funcionalities of the index, favoritos and mis gifos pages.
 */


let apiKey = 'aN6tuDgSQKVjGDlrpnbycWZMk51kvdtQ'
let trendingGifos = document.querySelector('.trending-gifos');
let sliderLeftButton = document.querySelector('#left.slider-button');
let sliderRightButton = document.querySelector('#right.slider-button');
let right = 0;

/**
 * API request to get the trending gifs and invoke function to render cards
 * @param {callback} callback - the function to execute when the data is received,
 * renderCard from card.js 
 */
async function getTrendingGifs(callback) {
    let response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=15&rating=g`);
    let trendingGifsRes = await response.json();
    callback(trendingGifsRes, trendingGifos, 'trending');
};

// slide right the trending gifs container
function slideRight() {
    if(right < 3840) {
        right += 960;
        trendingGifos.style.right = `${right}px`
        sliderLeftButton.classList.remove('disabled');
        if(right > 2880) {
            sliderRightButton.classList.add('disabled');
        };
    };
};

// slide left the trending gifs container
function slideLeft() {
    if(right > 0) {
        right -= 960;
        trendingGifos.style.right = `${right}px`;
        sliderRightButton.classList.remove('disabled');
        if(right === 0) {
            sliderLeftButton.classList.add('disabled');
        };
    };
};

// listen buttons of slider
function listenerButtons() {
    sliderRightButton.addEventListener('click', slideRight);
    sliderLeftButton.addEventListener('click', slideLeft);
};

export {getTrendingGifs, listenerButtons};
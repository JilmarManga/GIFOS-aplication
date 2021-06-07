/**
 *  Create gifs, containers to create gifs and render at screen.
 * create module, print in respective space.
 * upload gifs to diferent screens.
 */


import {darkModeButton, toggleDarkMode} from './modules/dark-mode.js'


let apiKey = 'aN6tuDgSQKVjGDlrpnbycWZMk51kvdtQ';
let videoFrame;
let startButton = document.getElementById('start-button');
let container = document.getElementById('container');
let frame = document.getElementById('frame');
let recorder;
let gifFrame;
let time;
let seconds = 0;
let blob;
let countSeconds;
let newP;
let lightAnimation = document.querySelector('#crear-gifo .light-camera');
let camAnimation1 = document.querySelector('#crear-gifo .camera-img-anim1');
let camAnimation2 = document.querySelector('#crear-gifo .camera-img-anim2');
let stepNumber1 = document.querySelector('#crear-gifo ol li:nth-child(1)');
let stepNumber2 = document.querySelector('#crear-gifo ol li:nth-child(2)');
let stepNumber3 = document.querySelector('#crear-gifo ol li:nth-child(3)');
let gifoCreated;
let overlay;
let myGifosStorage;
let myGifos = [];
let linkButton;
let downloadButton;

// Listener for dark mode button
darkModeButton.addEventListener('click', toggleDarkMode);

// Listener for start button
startButton.addEventListener('click', step1);

// modify DOM elements
function step1() {
    container.innerHTML = `
    <h2>¿Nos das acceso a tu cámara?</h2>
    <p>El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.</p>`
    startButton.classList.add('hidden');
    stepNumber1.classList.add('stepActive');
    accessUserCamera();
};

// ask user for permission to access the camera
function accessUserCamera() {
    navigator.mediaDevices.getUserMedia({audio: false, video: true})
    .then(stream => {
        step2(stream)
    })
    .catch(err => {
        console.log(err);
        accessDenied()
    })
};

/**
 * render user camera
 * @param {object} stream - response from promise
 */
function step2(stream) {
    let streamSettings = stream.getVideoTracks()[0].getSettings();
    let streamWidth = streamSettings.width;
    let streamHeight = streamSettings.height;
    container.innerHTML = `
    <video src="" id="video-frame"></video>
    <img id="gif-frame" class="hidden">`
    videoFrame = document.getElementById('video-frame');
    gifFrame = document.getElementById('gif-frame');
    videoFrame.srcObject = stream;
    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: streamWidth - ((streamWidth * 25) / 100),
        height: streamHeight - ((streamHeight * 25) / 100),
        hidden: 240,
        recorderType: GifRecorder,
        disableLogs: true,
        onGifPreview: function(gifURL) {
            gifFrame.src = gifURL;
            gifFrame.classList.remove('hidden');
            videoFrame.classList.add('hidden');
        }
    });

    startButton.classList.remove('hidden');
    startButton.innerHTML = 'Grabar';
    stepNumber1.classList.remove('stepActive');
    stepNumber2.classList.add('stepActive');
    videoFrame.play();
    startButton.removeEventListener('click', step1);
    startButton.addEventListener('click', recordGifo);
    recorder.camera = stream;
}

// render error message when promise is rejected
function accessDenied() {
    container.innerHTML = `
    <h2>No pudimos acceder a tu cámara :(</h2>`
};

// start recording gif and add counter
function recordGifo() {
    recorder.startRecording()  
    time = document.createElement('p')
    time.classList.add('time')
    frame.appendChild(time)
    countSeconds = setInterval(() => {
            if(seconds < 60) {
                if(seconds <= 9) {
                    seconds += 1
                    time.innerHTML = `00:00:0${seconds}`
                } else {
                    seconds += 1
                    time.innerHTML = `00:00:${seconds}`
                }
            }           
        }, 1000)

    camAnimation1.classList.add('play-animation')
    camAnimation2.classList.add('play-animation')
    lightAnimation.classList.add('play-animation')
    startButton.removeEventListener('click', recordGifo)
    startButton.innerHTML = 'Finalizar'
    startButton.addEventListener('click', endGifo)
};

// stop recording gif, generate blob object and render it     
function endGifo (){
    clearInterval(countSeconds)
    seconds = 0
    recorder.stopRecording(function() {
        blob = recorder.getBlob()
        gifoCreated = URL.createObjectURL(blob)
        gifFrame.src = gifoCreated
    })
    recorder.camera.stop()
    recorder.destroy()
    recorder = null
    startButton.innerHTML = 'Subir gifo'
    camAnimation1.classList.remove('play-animation')
    camAnimation2.classList.remove('play-animation')
    lightAnimation.classList.remove('play-animation')
    time.classList.add('hidden')
    newP = document.createElement('p')
    newP.classList.add('repeat')
    newP.innerHTML = 'Repetir Captura'
    newP.id = 'repeat-button'
    newP.addEventListener('click', () => {
        startButton.removeEventListener('click', step3)
        frame.removeChild(newP)
        accessUserCamera()
    })
    frame.appendChild(newP)
    startButton.removeEventListener('click', endGifo);
    startButton.addEventListener('click', step3);
};

// render uploading
function step3() {
    frame.removeChild(newP);
    stepNumber2.classList.remove('stepActive');
    stepNumber3.classList.add('stepActive');
    uploadGifo();
    overlay = document.createElement('div');
    overlay.classList.add('overlay-crear-gifo');
    overlay.innerHTML = `
    <img class="loader-icon" src="./img/loader.svg" alt="cargando">
    <p>Estamos subiendo tu GIFO</p>`
    container.appendChild(overlay);
    startButton.classList.add('hidden');
};

// post to API to upload new gif
async function uploadGifo() {
    let form = new FormData();
    form.append('file', blob, 'miGifo.gif');
    let response = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}&file=${form}`, {
        method: 'POST',
        body: form
    })
    let gif = await response.json()
    loadCompleted(gif)
};

// render upload success
function loadCompleted(myGifo) {
    let myGifoId = myGifo.data.id;
    myGifosStorage = localStorage.getItem('myGifos');
    overlay.innerHTML = `
        <div class="buttons-mygifo">
            <a id="myGifo-download">
                <button class="svg-button-mygifo" id="download-button">
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
            <a id="myGifo-link" target="_blank">
                <button class="svg-button-mygifo" id="link-button">        
                    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <path d="M18.5 12.667H21a3.333 3.333 0 110 6.666h-2.5a.833.833 0 000 1.667H21a5 5 0 000-10h-2.5a.833.833 0 100 1.667zM13.5 11a.833.833 0 110 1.667H11a3.333 3.333 0 100 6.666h2.5a.833.833 0 010 1.667H11a5 5 0 110-10zm5.833 4.167a.833.833 0 110 1.666h-6.666a.833.833 0 110-1.666z" id="a"/>
                        </defs>
                        <g fill-rule="nonzero" fill="none">
                            <rect fill="#FFF" opacity=".7" width="32" height="32" rx="6"/>
                            <use fill-opacity=".7" fill="#572EE5" xlink:href="#a"/>
                        </g>
                    </svg>
                </button>
            </a>
        </div>
        <img src="./img/ok.svg" alt="Cargado correctamente">
    <p>GIFO subido con éxito</p>`
    downloadButton = document.getElementById('myGifo-download');
    linkButton = document.getElementById('myGifo-link');
    downloadButton.href = gifoCreated;
    downloadButton.download = "mi gifo.gif";
    getMyGifo(myGifoId);
}

// api request to get data from new gif
async function getMyGifo(gifId) {
    let response = await fetch(`https://api.giphy.com/v1/gifs/${gifId}?api_key=${apiKey}`);
    let myGifoRes = await response.json();
    saveData(myGifoRes);
    linkButton.href = myGifoRes.data.url;
};

// save data from new gif in localStorage
function saveData(gif) {
    let gifObjetc = {
        id: gif.data.id, 
        title: gif.data.title, 
        username: gif.data.username,
        url: gif.data.images.original.url
    };

    myGifosStorage = localStorage.getItem('myGifos')

    if(JSON.parse(myGifosStorage) !== null) {
        myGifos.push(gifObjetc);
        myGifos = myGifos.concat(JSON.parse(myGifosStorage));
        localStorage.setItem('myGifos', JSON.stringify(myGifos));
    } else {
        myGifos.push(gifObjetc);
        localStorage.setItem('myGifos', JSON.stringify(myGifos));
    }    
};
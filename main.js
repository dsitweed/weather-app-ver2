const APP_ID = 'b4804b5e40c2a7a53cde8d8d3dee9af9';
const DEFAULT_VALUE = "--";

const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector(".city-name");
const weatherState = document.querySelector(".weather-state");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const timeNow = document.querySelector(".time-now");


const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".windSpeed");

//Co the tra ve thoi gian hien tai

searchInput.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        //lang vi ngon ngu dau ra cua api
        .then(async res => {
            const data = await res.json();
            //show data
            console.log("[Search Input]", data);
            cityName.innerHTML = data.name || DEFAULT_VALUE;
            weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
            weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;
            sunrise.innerHTML = moment.unix(data.sys.sunrise).format('HH:mm') || DEFAULT_VALUE;
            sunset.innerHTML = moment.unix(data.sys.sunset).format('HH:mm') || DEFAULT_VALUE;
            humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
            windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
            console.log(Date.now());
        });
});

//Lap trinh cho tro ly ao
// Su dung the web speech API
// Gom 2 phan nhan dien giong noi
// Va tu text ra giong noi

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition; //khai bao

var recognition = new SpeechRecognition(); //khai bao

recognition.lang = "vi-VI"; //Chinh ngon ngu dau vao
recognition.continuous = false; //Neu dang noi thi false dung thi true -> ket thuc

const mouth = window.speechSynthesis; //Khai bao bien mouth dung de doc
const microphone = document.querySelector(".microphone");


//Doc 1 doan van ban // chi co tieng anh
function speak(text) {
    if (mouth.speaking) {
        console.log("Speaking... please wait.");
        return;
    } //kiem tra mouth co dang ban khong

    //doc van ban 2 line
    const utter = new SpeechSynthesisUtterance();
    utter.text = text; //thiet lap noi dung noi
    speechSynthesis.speak(utter);
}

const handleVoice = function(text) {
    console.log("text", text);

    //Thoi tiet tai ha noi => [thoi tiet tai] [ha noi] // tai la pivot de ngat 
    //data =  ha noi 
    const handleText = text.toLowerCase();
    if (handleText.includes("thời tiết tại")) {
        const location = handleText.split("tại")[1].trim();
        console.log("location", location);
        searchInput.value = location;
        const changeEvent = new Event("change");
        searchInput.dispatchEvent(changeEvent);
    } else {
        speak("try again");
    }
}

microphone.addEventListener("click", (e) => {
    e.preventDefault(); //Huy su kien neu co the

    recognition.start(); //bat dau ghi am
});

recognition.onspeechend = function() {
    recognition.stop(); //Stop
}

//Nhan loi
recognition.onerror = function(event) {
    console.error("Error occurred in recognition: " + event.error);
}

//Tra ve ket qua
recognition.onresult = function(event) {
    console.log(event);
    const text = event.results[0][0].transcript;
    handleVoice(text);
}
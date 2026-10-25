const map = L.map('map').setView([15.5007, 32.5599], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let currentMarker = null;

const form = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const spinner = document.getElementById('loading-spinner');
const errorCard = document.getElementById('error-card');

const API_KEY = 'e29f791238eeceea22e855c4de32a7ed';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const locationName = locationInput.value.trim();
    
    if (!locationName) return;

    spinner.classList.remove('hidden');
    errorCard.classList.add('hidden');
    errorCard.textContent = '';

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationName)}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('لم يتم العثور على المدينة المطلوبة');
        }

        const data = await response.json();
        
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        const cityName = data.name;
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        map.setView([lat, lon], 12);

        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        const popupContent = `
            <div style="text-align: center; font-family: Roboto, sans-serif;">
                <h3 style="margin: 0 0 5px 0; color: #0f172a;">${cityName}</h3>
                <img src="${iconUrl}" alt="weather icon" style="width: 50px; height: 50px; margin: 0;">
                <p style="font-size: 24px; font-weight: bold; margin: 5px 0; color: #2563eb;">${temp}°C</p>
                <p style="margin: 0; text-transform: capitalize; color: #64748b;">${description}</p>
            </div>
        `;

        currentMarker = L.marker([lat, lon]).addTo(map)
            .bindPopup(popupContent)
            .openPopup();

    } catch (err) {
        errorCard.textContent = 'خطأ: تعذر جلب بيانات الطقس، تأكد من صحة اسم المدينة ومفتاح الـ API.';
        errorCard.classList.remove('hidden');
    } finally {
        spinner.classList.add('hidden');
    }
});

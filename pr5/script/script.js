// Координати коледжу
const COLLEGE = [48.94312, 24.73375];

// DOM елементи
const coordsEl = document.getElementById('coords');
const accuracyEl = document.getElementById('accuracy');
const distanceEl = document.getElementById('distance');
const timestampEl = document.getElementById('timestamp');

const btnGet = document.getElementById('btnGet');
const btnWatch = document.getElementById('btnWatch');
const btnClear = document.getElementById('btnClear');
const btnAddMarker = document.getElementById('btnAddMarker');
const destInput = document.getElementById('destInput');
const btnGoTo = document.getElementById('btnGoTo');

let map, userMarker, watchId = null, trackLine;

// Створюємо карту
map = L.map('map').setView([0,0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

// Маркер коледжу
L.marker(COLLEGE).addTo(map).bindPopup("Коледж ІФНТУНГ");

// Переведення в радіани
function toRad(deg) {
	return deg * Math.PI / 180;
}

// Відстань між двома точками (метри)
function haversine([lat1,lng1],[lat2,lng2]) {
	const R = 6371000;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
	return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Показати місце користувача
function showLocation(pos) {
	const lat = pos.coords.latitude;
	const lng = pos.coords.longitude;
	const acc = pos.coords.accuracy;
	const time = new Date(pos.timestamp);

	// Попередження, якщо точність низька
	if(acc > 50) {
		console.warn(`Низька точність: ${acc} м. Результат може бути приблизним.`);
	}

	coordsEl.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
	accuracyEl.textContent = `${acc} м`;
	timestampEl.textContent = time.toLocaleString();
	distanceEl.textContent = haversine([lat,lng], COLLEGE).toFixed(1) + " м";

	const popupText = `Тут ви:<br>${lat.toFixed(6)}, ${lng.toFixed(6)}<br>точність: ${acc} м`;

	// Маркер користувача
	if(!userMarker) {
		userMarker = L.marker([lat,lng]).addTo(map).bindPopup(popupText).openPopup();
	} else {
		userMarker.setLatLng([lat,lng]).setPopupContent(popupText);
	}

	map.setView([lat,lng], 15);

	// Додаємо точку в трек
	if(trackLine) trackLine.addLatLng([lat,lng]);
}

// Обробка помилки
function showError(err) {
	alert(`Помилка: ${err.message}\nКод: ${err.code}`);
}

// Опції геолокації
const geoOpts = { enableHighAccuracy:true, timeout:20000, maximumAge:0 };

// Отримати разово
function getMyLocation() {
	navigator.geolocation.getCurrentPosition(showLocation, showError, geoOpts);
}

// Стеження
function startWatch() {
	if(watchId) return;

	// Видаляємо стару лінію треку
	if(trackLine) trackLine.remove();
	trackLine = L.polyline([], {color:'red'}).addTo(map);

	watchId = navigator.geolocation.watchPosition(
		pos => showLocation(pos),
		showError,
		geoOpts
	);
}

// Зупинити стеження
function stopWatch() {
	if(watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}

// Додати маркер вручну
function addMarker() {
	if(!userMarker) return;
	const c = userMarker.getLatLng();
	L.marker([c.lat,c.lng]).addTo(map).bindPopup("Мій маркер").openPopup();
}

// Перейти до точки
function goToDest() {
	const txt = destInput.value.trim();
	if(!txt) return;

	const parts = txt.split(",").map(Number);
	const lat = parts[0];
	const lng = parts[1];

	if(isNaN(lat) || isNaN(lng)) {
		alert("Введіть координати у форматі lat,lng");
		return;
	}

	map.setView([lat,lng], 16);
	L.circleMarker([lat,lng], { radius:6 }).addTo(map).bindPopup("Пункт призначення").openPopup();
}

// Кнопки
btnGet.addEventListener("click", getMyLocation);
btnWatch.addEventListener("click", startWatch);
btnClear.addEventListener("click", stopWatch);
btnAddMarker.addEventListener("click", addMarker);
btnGoTo.addEventListener("click", goToDest);

import * as L from 'leaflet';

function initializeMap() {
  const map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}


document.addEventListener("DOMContentLoaded", () => {
  const recordList = document.getElementById("recordList");
  const totalHoursElement = document.getElementById("totalHours");
  const totalVideosElement = document.getElementById("totalVideos");
  const totalReturnVisitElement = document.getElementById("totalReturnVisit");
  const totalBibleStudyElement = document.getElementById("totalBibleStudy");
  const totalBooksElement = document.getElementById("totalBooks");

  let records = [];

  const map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

 

  const googleMapsScript = document.createElement('script');
googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBs-THNeMB_GwhroQ7ELQP38alB4q_Lva8&libraries=places`;
googleMapsScript.onload = initializeMap;
document.head.appendChild(googleMapsScript);

  const geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: "Enter the address..."
  }).on('markgeocode', e => {
    const lat = e.geocode.center.lat;
    const lon = e.geocode.center.lng;
    reverseGeocode(lat, lon);
    map.setView([lat, lon], 15);
    L.marker([lat, lon]).addTo(map).bindPopup(e.geocode.name).openPopup();
  }).addTo(map);

  const getCurrentLocationButton = document.getElementById('getCurrentLocationButton');
  getCurrentLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();

            if (data.display_name) {
              const address = data.display_name;

              document.getElementById('address').value = address;

              map.setView([lat, lon], 15);
              L.marker([lat, lon]).addTo(map).bindPopup(address).openPopup();
            } else {
              alert('Address not found.');
            }
          } catch (error) {
            console.error('Error fetching address:', error);
            alert('Error fetching address. Please try again.');
          }
        },
        error => {
          console.error('Error getting current location:', error);
          alert('Error getting current location. Please try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  });

  function reverseGeocode(lat, lon) {
    const latLng = new google.maps.LatLng(lat, lon);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        alert(`Reverse Geocoded Address: ${address}`);
      } else {
        alert("Address not found.");
      }
    });
  }

  // ... (continue with the rest of your code)

   function addRecord() {
    const date = document.getElementById("date").value;
    const returnVisit = parseFloat(document.getElementById("returnVisit").value) || 0;
    const bibleStudy = parseFloat(document.getElementById("bibleStudy").value) || 0;
    const hour = parseFloat(document.getElementById("hour").value) || 0;
    const books = parseFloat(document.getElementById("books").value) || 0;
    const videos = parseFloat(document.getElementById("videos").value) || 0;

    const address = document.getElementById("address").value;
    const name = document.getElementById("name").value;
    const book = document.getElementById("book").value;

    const newRecord = {
      date,
      returnVisit,
      bibleStudy,
      hour,
      books,
      videos,
      address,
      name,
      book,
    };

    // Clear input fields
    document.getElementById("date").value = "";
    document.getElementById("returnVisit").value = "";
    document.getElementById("bibleStudy").value = "";
    document.getElementById("hour").value = "";
    document.getElementById("books").value = "";
    document.getElementById("videos").value = "";
    document.getElementById("address").value = "";
    document.getElementById("name").value = "";
    document.getElementById("book").value = "";

    records.push(newRecord);

    // Update the UI with the new record
    loadRecords();
  }

  // Add event listener to the Add Record button
  const addRecordButton = document.getElementById("addRecordButton");
  addRecordButton.addEventListener("click", addRecord);

  // ... (continue with the rest of your code)
});

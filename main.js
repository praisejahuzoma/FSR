const recordList = document.getElementById("recordList");
const totalHoursElement = document.getElementById("totalHours");
const totalVideosElement = document.getElementById("totalVideos");
const totalReturnVisitElement = document.getElementById("totalReturnVisit");
const totalBibleStudyElement = document.getElementById("totalBibleStudy");
const totalBooksElement = document.getElementById("totalBooks");

let records = [];

// Function to update the local storage
function updateLocalStorage() {
  localStorage.setItem("records", JSON.stringify(records));
}
const map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


const getAddressButton = document.getElementById('getAddressButton');

getAddressButton.addEventListener('click', () => {
  const address = prompt('Enter the address:');
  if (address) {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const location = data[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);
          map.setView([lat, lon], 15);
          L.marker([lat, lon]).addTo(map).bindPopup(address).openPopup();
        } else {
          alert('Address not found.');
        }
      })
      .catch(error => {
        console.error('Error fetching address:', error);
      });
  }
});

const getCurrentLocationButton = document.getElementById('getCurrentLocationButton');

getCurrentLocationButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const address = `Latitude: ${lat}, Longitude: ${lon}`;

        // Update the address input field with the current location
        document.getElementById('address').value = address;

        // Set the map view to the current location
        map.setView([lat, lon], 15);
        L.marker([lat, lon]).addTo(map).bindPopup(address).openPopup();
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

function deleteRecord(button) {
  const li = button.parentElement;
  const index = Array.from(recordList.children).indexOf(li);
  const record = records[index];

  // Remove from UI
  recordList.removeChild(li);

  // Remove from local records array
  records.splice(index, 1);

  // Update totals
  updateTotals();

  updateLocalStorage();
}

function loadRecords() {
  recordList.innerHTML = "";

  let totalHours = 0;
  let totalVideos = 0;
  let totalReturnVisit = 0;
  let totalBibleStudy = 0;
  let totalBooks = 0;

  for (const record of records) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>Date: ${record.date}</span>
      <span>Return Visit: ${record.returnVisit}</span>
      <span>Bible Study: ${record.bibleStudy}</span>
      <span>Hour: ${record.hour}</span>
      <span>Books: ${record.books}</span>
      <span>Videos: ${record.videos}</span>
      <span>Address: ${record.address}</span>
      <span>Householder: ${record.householder}</span>
      <span>Name: ${record.name}</span>
      <span>Book Given: ${record.book}</span>
      <button class="delete-button">Delete</button>
    `;

    recordList.appendChild(li);

    totalHours += record.hour;
    totalVideos += record.videos;
    totalReturnVisit += record.returnVisit;
    totalBibleStudy += record.bibleStudy;
    totalBooks += record.books;
  }

  updateTotals(totalHours, totalVideos, totalReturnVisit, totalBibleStudy, totalBooks);

  // Add event listeners to the delete buttons
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach(button => {
    button.addEventListener("click", () => deleteRecord(button));
  });
}



function updateTotals() {
  let totalHours = 0;
  let totalVideos = 0;
  let totalReturnVisit = 0;
  let totalBibleStudy = 0;
  let totalBooks = 0;

  for (const record of records) {
    totalHours += record.hour;
    totalVideos += record.videos;
    totalReturnVisit += record.returnVisit;
    totalBibleStudy += record.bibleStudy;
    totalBooks += record.books;
  }

  totalHoursElement.textContent = totalHours.toFixed(2);
  totalVideosElement.textContent = totalVideos;
  totalReturnVisitElement.textContent = totalReturnVisit;
  totalBibleStudyElement.textContent = totalBibleStudy;
  totalBooksElement.textContent = totalBooks;
}

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

  // Add the new record to the local array
  records.push(newRecord);

  // Update the UI and totals
  loadRecords();
  updateLocalStorage();

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
}



function fetchRecords() {
  const storedRecords = localStorage.getItem("records");
  if (storedRecords) {
    records = JSON.parse(storedRecords);
    loadRecords();
  }
}

// Load records from local storage when the page loads
fetchRecords();

// Add event listener to the Add Record button
const addRecordButton = document.getElementById("addRecordButton");
addRecordButton.addEventListener("click", addRecord);

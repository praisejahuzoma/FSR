const recordList = document.getElementById("recordList");
    const totalHoursElement = document.getElementById("totalHours");
    const totalVideosElement = document.getElementById("totalVideos");
    const totalReturnVisitElement = document.getElementById("totalReturnVisit");
    const totalBibleStudyElement = document.getElementById("totalBibleStudy");
    const totalBooksElement = document.getElementById("totalBooks");
  
    let records = JSON.parse(localStorage.getItem("records")) || [];
    let totalHours = 0;
    let totalVideos = 0;
    let totalReturnVisit = 0;
    let totalBibleStudy = 0;
    let totalBooks = 0;
  
    function updateLocalStorage() {
      localStorage.setItem("records", JSON.stringify(records));
    }
  
    function addRecord() {
      const date = document.getElementById("date").value;
      const returnVisit = parseFloat(document.getElementById("returnVisit").value) || 0;
      const bibleStudy = parseFloat(document.getElementById("bibleStudy").value) || 0;
      const hour = parseFloat(document.getElementById("hour").value) || 0;
      const books = parseFloat(document.getElementById("books").value) || 0;
      const videos = parseFloat(document.getElementById("videos").value) || 0;
  
      records.push({
        date,
        returnVisit,
        bibleStudy,
        hour,
        books,
        videos
      });
  
      // Update totals
      totalHours += hour;
      totalVideos += videos;
      totalReturnVisit += returnVisit;
      totalBibleStudy += bibleStudy;
      totalBooks += books;
  
      updateLocalStorage();
      loadRecords();
  
      // Clear input fields
      document.getElementById("date").value = "";
      document.getElementById("returnVisit").value = "";
      document.getElementById("bibleStudy").value = "";
      document.getElementById("hour").value = "";
      document.getElementById("books").value = "";
      document.getElementById("videos").value = "";
    }
  
    function deleteRecord(button) {
      const li = button.parentElement;
      const index = Array.from(recordList.children).indexOf(li);
      const record = records[index];
  
      recordList.removeChild(li);
  
      // Update totals
      totalHours -= record.hour;
      totalVideos -= record.videos;
      totalReturnVisit -= record.returnVisit;
      totalBibleStudy -= record.bibleStudy;
      totalBooks -= record.books;
  
      records.splice(index, 1);
      updateLocalStorage();
      updateTotals(); // Update totals after deleting a record
    }
  
    function loadRecords() {
      recordList.innerHTML = "";
  
      for (const record of records) {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>Date: ${record.date}</span>
          <span>Return Visit: ${record.returnVisit}</span>
          <span>Bible Study: ${record.bibleStudy}</span>
          <span>Hour: ${record.hour}</span>
          <span>Books: ${record.books}</span>
          <span>Videos: ${record.videos}</span>
          <button onclick="deleteRecord(this)">Delete</button>
        `;
  
        recordList.appendChild(li);
      }
  
      updateTotals();
    }
  
    function updateTotals() {
      totalHoursElement.textContent = totalHours.toFixed(2);
      totalVideosElement.textContent = totalVideos;
      totalReturnVisitElement.textContent = totalReturnVisit;
      totalBibleStudyElement.textContent = totalBibleStudy;
      totalBooksElement.textContent = totalBooks;
    }
  
    // Load records when the page loads
    loadRecords();
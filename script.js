import * as L from './leaflet';

const addRecordButton = document.getElementById("addRecordButton");
addRecordButton.addEventListener("click", addRecord);

import { addRecord } from './main.js';

document.addEventListener("DOMContentLoaded", function () {
  const addRecordButton = document.getElementById("addRecordButton");
  addRecordButton.addEventListener("click", addRecord);
});
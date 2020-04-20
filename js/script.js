const container = document.querySelector(".container");
const out = document.querySelector(".out");
const code = out.querySelector(".code");
const display = out.querySelector(".display");
const help = document.querySelector(".help");
let rangeHeight, boxTBody;
const range = document.querySelector("#range");
const rangeWidth = 160;
range.style.width = rangeWidth + "px";
container.style.marginLeft = rangeWidth + "px";
range.addEventListener("mousemove", handleSelectPrefix);
range.addEventListener("click", handleChangePrefix);
const lineH = range.querySelector(".line-h");
const lineV = range.querySelector(".line-v");
help.style.left = "2px";
help.style.width = rangeWidth + "px";
let row = [],
  col = [];

function creatUtfTable(l, c) {
  const tab = [],
    topHeaders = [],
    rowHeaders = [];
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  table.appendChild(thead);
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.classList.add("col1");
  const select1 = document.createElement("select");
  const select2 = document.createElement("select");
  select1.addEventListener("change", refreshTable);
  select2.addEventListener("change", refreshTable);
  th.appendChild(select1);
  th.appendChild(select2);
  tr.appendChild(th);
  topHeaders.push(th);
  thead.appendChild(tr);
  for (let h = 0; h < c; h++) {
    const th = document.createElement("th");
    th.innerText = h.toString(16).toUpperCase();
    tr.appendChild(th);
    topHeaders.push(th);
  }
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  for (let i = 0; i < l; i++) {
    tab[i] = [];
    const tr = document.createElement("tr");
    tbody.appendChild(tr);
    const th = document.createElement("th");
    tr.appendChild(th);
    rowHeaders.push(th);
    for (let j = 0; j < c; j++) {
      const td = document.createElement("td");
      td.setAttribute("data-i", i);
      td.setAttribute("data-j", j);
      tr.appendChild(td);
      tab[i][j] = td;
      td.addEventListener("mouseenter", displayChar);
    }
  }
  for (let i = 0; i < 16; i++) {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = i.toString(16).toUpperCase();
    option2.value = i.toString(16).toUpperCase();
    option1.innerText = option1.value;
    option2.innerText = option2.value;
    select1.appendChild(option1);
    select2.appendChild(option2);
  }
  select1.value = "2";
  select2.value = "6";

  return [table, tab, topHeaders, rowHeaders, select1, select2, tbody, thead];
}

function displayChar() {
  const i = this.dataset.i;
  const j = this.dataset.j;
  code.innerText = rowHeaders[i].innerText + topHeaders[j * 1 + 1].innerText;
  display.innerText = this.innerText;
  const box = getPosition(i, j);
  out.style.left = box.x + "px";
  out.style.top = box.y + "px";
  highlightCells(i, j);
}
function getPosition(i, j) {
  const x = i < 8 ? "0" : "1";
  const y = j < 8 ? "0" : "1";
  switch (parseInt(x + y, 2)) {
    case 0:
      return tab[9][9].getBoundingClientRect();
    case 1:
      return tab[9][2].getBoundingClientRect();
    case 2:
      return tab[2][9].getBoundingClientRect();
    case 3:
      return tab[2][2].getBoundingClientRect();
  }
}
const [
  table,
  tab,
  topHeaders,
  rowHeaders,
  select1,
  select2,
  tbody,
  thead,
] = creatUtfTable(16, 16);

function handleSelectPrefix(evt) {
  let [x, y, indexX, indexY] = getIndexes(evt);
  select1.selectedIndex = indexY;
  select2.selectedIndex = indexX;
  indexX = indexX < 0 ? 0 : indexX > 15 ? 15 : indexX;
  indexY = indexY < 0 ? 0 : indexY > 15 ? 15 : indexY;
  displayChar.call(tab[indexY][indexX]);
}

function handleChangePrefix(evt) {
  const [x, y, indexX, indexY] = getIndexes(evt);
  refreshTable();
}
function getIndexes(evt) {
  const deltaY = rangeHeight / 16;
  const deltaX = rangeWidth / 16;
  const y = evt.pageY - boxTBody.y;
  const x = evt.pageX - 2;
  lineH.style.top = y + "px";
  lineV.style.left = x + "px";

  const indexY = parseInt(y / deltaY);
  const indexX = parseInt(x / deltaX);
  return [x, y, indexX, indexY];
}
function highlightCells(i, j) {
  row.forEach((cell) => cell.classList.remove("row-cell"));
  col.forEach((cell) => cell.classList.remove("col-cell"));
  row = tab[i];
  col = tab.map((r) => r[j]);
  row.forEach((cell) => cell.classList.add("row-cell"));
  col.forEach((cell) => cell.classList.add("col-cell"));
}
container.appendChild(table);

function refreshTable() {
  prefix = select1.value + select2.value;
  tab.forEach((row, i) => {
    const rowContent = prefix + i.toString(16).toUpperCase();
    rowHeaders[i].innerText = rowContent;
    row.forEach((td, j) => {
      const char = "0x" + prefix + i.toString(16) + j.toString(16);
      console.log(char, String.fromCharCode(char));
      td.innerText = String.fromCharCode(char);
    });
  });
  boxTBody = tbody.getBoundingClientRect();
  boxTHead = thead.getBoundingClientRect();
  help.style.top = boxTHead.y + "px";
  range.style.top = boxTBody.y + "px";
  help.style.height = boxTHead.height + "px";
  range.style.height = boxTBody.height + "px";
  rangeHeight = boxTBody.height;
}
refreshTable();

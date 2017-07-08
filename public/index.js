const createTR = () => {
  for (let i = 0; i < 10; i++) {
    let tr = document.createElement('tr');
    tr.id = 'row' + (i + 1);
    document.getElementById('main').appendChild(tr);
    createTD(tr.id, i);
  }
}

const createTD = (rowId, count) => {
  for (let i = 0; i < 10; i++) {
    let td = document.createElement('td');
    td.id = 'td' + (i + count*10);
    document.getElementById(rowId).appendChild(td);
  }
}

const fillTD = (obj, count) => {
  let h4 = document.createElement('h4');
  let coinname = document.createElement('p');
  let paragraph = document.createElement('p');
  let td = 'td' + count;
  h4.textContent = obj.symbol;
  coinname.textContent = obj.name;
  h4.className = 'white';
  coinname.className = 'white';
  paragraph.className = 'white';
  paragraph.textContent = obj.percent_change_24h + '%';
  document.getElementById(td).dataset.value = obj.percent_change_24h;
  document.getElementById(td).appendChild(h4);
  document.getElementById(td).appendChild(coinname);
  document.getElementById(td).appendChild(paragraph);
}

const color = () => {
  let elements = document.querySelectorAll('td');
  elements.forEach(item => {
    let change = Number(item.dataset.value);
    let absVal = Math.abs(change);
    if (absVal > 19.999) {
      (Math.sign(change) === 1) ? 
        item.style.backgroundColor = '#00ff00':
        item.style.backgroundColor = '#ff0000';
    }
    if (absVal <= 19.999 && absVal >= 15) {
      (Math.sign(change) === 1) ? 
        item.style.backgroundColor = '#00e500':
        item.style.backgroundColor = '#e50000';      
    }
    if (absVal <= 14.999 && absVal >= 10) {
      (Math.sign(change) === 1) ? 
        item.style.backgroundColor = '#00cc00':
        item.style.backgroundColor = '#b20000';
    }
    if (absVal <= 9.999 && absVal >= 2) {
      (Math.sign(change) === 1) ? 
        item.style.backgroundColor = '#007f00':
        item.style.backgroundColor = '#7f0000';
    }
    if (absVal <= 1.999 && absVal >= 0.01) {
      (Math.sign(change) === 1) ? 
        item.style.backgroundColor = '#004c00':
        item.style.backgroundColor = '#330000';
    }
    if (absVal === 0) {
      item.style.backgroundColor = '#494f5e';
    }
  });
}
const getData = () => {
  let http = new XMLHttpRequest();
  let url = 'https://api.coinmarketcap.com/v1/ticker/?limit=100';
  http.open('GET', url, true);
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      if (http.status === 200) {
        let response = JSON.parse(http.response);
        createTR();
        response.map((object, index) => {
          fillTD(object, index);         
        });
        color();
      } else {
        console.log('error fetching data')
      }
    }
  }
  http.send();
}

getData();


const createTR = function() {
  for (let i = 0; i < 10; i++) {
    let tr = document.createElement('tr');
    tr.id = 'row' + (i + 1);
    document.getElementById('main').appendChild(tr);
    createTD(tr.id, i);
  }
};

const createTD = function(rowId, count) {
  for (let i = 0; i < 10; i++) {
    let td = document.createElement('td');
    td.id = (i + count*10);
    document.getElementById(rowId).appendChild(td);
  }
};

const fillTD = function(object, count) {
  let h4 = document.createElement('h4');
  let coinname = document.createElement('p');
  let paragraph = document.createElement('p');
  let td = count;
  h4.innerHTML = object.symbol;
  h4.className = 'white';
  h4.id = object.rank+'h4';
  coinname.innerHTML = object.name;
  coinname.className = 'white';
  coinname.id = object.rank +'p'
  paragraph.className = 'white';
  paragraph.id = object.name;
  paragraph.id = object.rank + '_change';
  if (object.percent_change_24h === null) {
    paragraph.innerHTML = '0.0%';
  } else {
    paragraph.innerHTML = object.percent_change_24h + '%';    
  }
  document.getElementById(td).dataset.value = object.percent_change_24h;
  document.getElementById(td).appendChild(h4);
  document.getElementById(td).appendChild(coinname);
  document.getElementById(td).appendChild(paragraph);
};

const color = function() {
  let elements = document.querySelectorAll('td');
  elements.forEach(item => {
    let change = parseFloat(item.dataset.value);
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
    if (absVal === 0 || isNaN(absVal)) {
      item.style.backgroundColor = '#494f5e';
    }
  });
};

const getData = function() {
  let http = new XMLHttpRequest();
  let url = 'https://api.coinmarketcap.com/v1/ticker/?limit=100';
  http.open('GET', url, true);
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      if (http.status === 200) {
        let response = JSON.parse(http.response);
        let up = 0;
        let down = 0;
        let totalCap = 0;
        createTR();
        response.map((object, index) => {
          fillTD(object, index);
          let current = parseFloat(object.percent_change_24h);
          if (current > 0) {
            up++;
          }
          if (current < 0) {
            down++;
          }
          totalCap += parseFloat(object.market_cap_usd);
        });
        document.getElementById('up').textContent = up;
        document.getElementById('down').textContent = down;
        document.getElementById('marketcap').innerHTML = `$${totalCap.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
        color();
      } else {
        console.log('error fetching data');
      }
    }
  };
  http.send();
};

const updateData = function() {
  let http = new XMLHttpRequest();
  let url = 'https://api.coinmarketcap.com/v1/ticker/?limit=100';
  http.open('GET', url, true);
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      if (http.status === 200) {
        let response = JSON.parse(http.response);
        let up = 0;
        let down = 0;
        let totalCap = 0;
        response.map((object, index) => {
          let h4 = document.getElementById(object.rank + 'h4');
          let paragraph = document.getElementById(object.rank + 'p');
          let paragraph2= document.getElementById(object.rank + '_change');
          let tableData = document.getElementById(index);
          let current = parseFloat(object.percent_change_24h);
          let defaultColor = tableData.style.backgroundColor;
          document.getElementById(index).dataset.value = object.percent_change_24h;
          h4.innerHTML = object.symbol;
          paragraph.innerHTML = object.name;
          if (current > 0) {
            up++;
          }
          if (current < 0) {
            down++;
          }          
          if (object.percent_change_24h === null) {
            paragraph2.innerHTML = '0.0%';
          } else {
            paragraph2.innerHTML = object.percent_change_24h + '%';  
          }
          totalCap += parseFloat(object.market_cap_usd);         
        });
        color();
        document.getElementById('up').textContent = up;
        document.getElementById('down').textContent = down;
        document.getElementById('marketcap').innerHTML = `$${totalCap.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
        document.querySelectorAll('td').forEach((element, index) => {
          let symbol = element.firstChild.textContent;
        });
      } else {
        console.log('error updating data');
      }
    }
  };
  http.send();  
};

getData();
setInterval(updateData, 60000);

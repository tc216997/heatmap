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
    td.id = 'td' + (i + count*10);
    document.getElementById(rowId).appendChild(td);
  }
};

const fillTD = function(obj, count) {
  let h4 = document.createElement('h4');
  let coinname = document.createElement('p');
  let paragraph = document.createElement('p');
  let td = 'td' + count;
  h4.innerHTML = obj.symbol;
  coinname.innerHTML = obj.name;
  h4.className = 'white';
  coinname.className = 'white';
  paragraph.className = 'white';
  paragraph.id = obj.symbol + '_change';
  paragraph.innerHTML = obj.percent_change_24h + '%';
  document.getElementById(td).dataset.value = obj.percent_change_24h;
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
    if (absVal === 0) {
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
        createTR();
        response.map((object, index) => {
          fillTD(object, index);
          let current = Number(object.percent_change_24h);
          current > 0 ? up++:down++;
        });
        document.getElementById('up').textContent = up;
        document.getElementById('down').textContent = down;
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
        response.map((object, index) => {
          let ele = document.getElementById(object.symbol + '_change');
          let td = document.getElementById('td'+index);
          let previous = parseFloat(ele.innerHTML.substring(0, ele.innerHTML.length -1)); //Number(ele.innerHTML.substring(0, ele.textContent.length-1));
          let current = parseFloat(object.percent_change_24h);
          current > 0 ? up++:down++;
          if (previous !== current) {
            let defaultColor = td.style.backgroundColor;
            if (current > previous) {
              td.style.backgroundColor = 'rgb(102, 0, 0)';
              setTimeout(() => {
                td.style.backgroundColor = defaultColor;
              }, 600);
            } else {
              td.style.backgroundColor = 'rgb(0, 76, 0)';
              setTimeout(() => {
                td.style.backgroundColor = defaultColor;
              }, 600);
            }
          }
          ele.innerHTML = object.percent_change_24h + '%';
        });
        document.getElementById('up').textContent = up;
        document.getElementById('down').textContent = down;
      } else {
        console.log('error updating data');
      }
    }
  };
  http.send();  
};

getData();
setInterval(updateData, 60000);

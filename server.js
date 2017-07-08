const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public'));
});

app.all('*', (req, res) => {
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
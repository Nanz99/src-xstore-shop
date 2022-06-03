require('dotenv').config({ path: './.env' });
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Portal is running at ' + process.env.PORT || 5000);
});

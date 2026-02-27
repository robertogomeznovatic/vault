const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const vaultRoutes = require('./routes/vault');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.use('/', authRoutes);
app.use('/vault', vaultRoutes);



app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
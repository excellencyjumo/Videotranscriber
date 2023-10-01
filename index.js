const express = require('express');
const app = express();
require('dotenv').config();
require('./utils/db.js');

const port = process.env.PORT || 3000;

// import routes
app.use('/extension', require('./routes/index.js'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

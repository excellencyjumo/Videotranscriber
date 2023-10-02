const express = require('express');
const app = express();
const PORT = 8080;

// Import and initialize the database connection
require('./utils/db.js');

// Import and use routes
const indexRoutes = require('./routes/index.js');
app.use('/', indexRoutes);

// Middleware for handling "PAGE UNAVAILABLE" errors
app.use((_req, _res, next) => {
  next("PAGE UNAVAILABLE");
});

// Error handler for all other errors
app.use((err, _req, res, _next) => {
  res.send(err);
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

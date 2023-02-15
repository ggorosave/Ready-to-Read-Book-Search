const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

// ADD typeDefs, resolvers 

const db = require('./config/connection');
// DELETE LATER
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
// Add apollo server

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// DELETE LATER
// app.use(routes);

// sends html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// Write start apollo server function and call it
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

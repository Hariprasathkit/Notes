require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Notes API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
    process.exitCode = 1;
  }
}

startServer();

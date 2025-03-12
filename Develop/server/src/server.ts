import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Construct __dirname since it's not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the routes
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
console.log(__dirname);
app.use(express.static(path.join(__dirname, '../../client/dist')));

// TODO: Implement middleware for parsing JSON and urlencoded form data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implement middleware to log requests (res, req, next)
app.use((req, _res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

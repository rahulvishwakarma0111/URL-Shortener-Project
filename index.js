import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/user.routes.js';
import urlRoutes from './routes/url.routes.js';
import { authenticateToken } from './middleware/auth.middleware.js';
const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(authenticateToken);
app.use('/user', userRoutes);
app.use('/url', urlRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});     



const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

app.post('/api/register', (req, res) => {
  console.log('Register request received:', req.body);
  res.json({ 
    success: true, 
    message: 'Test registration endpoint',
    data: req.body 
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});

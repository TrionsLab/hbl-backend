const express = require('express');
const cors = require('cors');
const billRoutes = require('./routes/billRoutes');
const referencesRoutes = require('./routes/referenceRoutes');
const deletedBillRoutes = require('./routes/deletedBillRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working 🚀' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      port: '3306',
      host: 'mysql.railway.internal',
      user: 'root',
      password: 'admin',
      database: 'clinic',
    });

    const [rows] = await connection.query('SELECT NOW() AS now');
    res.json({ message: 'DB Connected ✅', serverTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ message: 'DB Connection Failed ❌', error: err.message });
  }
});

// Routes
app.use('/api/bills', billRoutes);
app.use('/api/pc-doc-ref', referencesRoutes);
app.use('/api/deleted-bills', deletedBillRoutes);

app.listen(3000, () => console.log('Server started'));

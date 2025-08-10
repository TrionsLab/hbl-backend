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

// Routes
app.use('/api/bills', billRoutes);
app.use('/api/pc-doc-ref', referencesRoutes);
app.use('/api/deleted-bills', deletedBillRoutes);

app.listen(3000, () => console.log('Server started'));

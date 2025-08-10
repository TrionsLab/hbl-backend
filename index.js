const express = require('express');
const cors = require('cors');
const billRoutes = require('./routes/billRoutes');
const referencesRoutes = require('./routes/referenceRoutes');
const deletedBillRoutes = require('./routes/deletedBillRoutes');
// const authRoutes = require('./routes/authRoutes'); // Add this line
// const { authenticateJWT } = require('./middleware/authMiddleware'); // Add this line

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
// app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/bills', billRoutes);
app.use('/api/pc-doc-ref', referencesRoutes);
app.use('/api/deleted-bills', deletedBillRoutes);

app.listen(3000, () => console.log('Server started'));
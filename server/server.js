const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const viewRoutes = require('./routes/ViewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

mongoose.connect('mongodb+srv://purugcit79:purugcit79@govchain.kceoiy1.mongodb.net/').then(() => console.log("Connected to MongoDB"));

app.use('/api/user', userRoutes);
app.use('/', viewRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

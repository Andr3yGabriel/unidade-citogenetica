const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./src/config/Database');
app.use(express.json({ limit: "5mb" }));
const authRoutes = require('./src/routes/routes');
const Patient = require('./src/models/Patient');
const Worker = require('./src/models/Worker');
const Exam = require('./src/models/Exam');
app.use(cors());
app.use('/api', authRoutes);

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await Patient.sync({ alter: true });
    await Worker.sync({ alter: true });
    await Exam.sync({ alter: true });

    console.log('Database synchronized');

    sequelize.authenticate()
      .then(() => console.log('Connection established successfully.'))
      .catch((error) => console.error('Unable to connect to the database:', error));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();

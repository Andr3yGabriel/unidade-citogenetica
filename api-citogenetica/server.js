const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./src/config/Database');
app.use(express.json({ limit: "5mb" }));
const authRoutes = require('./src/routes/routes');
const UserType = require('./src/models/UserType');
const User = require('./src/models/User');
const Exam = require('./src/models/Exam');
app.use(cors());
app.use('/api', authRoutes);

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await UserType.sync({ alter: true });
    await User.sync({ alter: true });
    await Exam.sync({ alter: true });

    await UserType.seed();

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

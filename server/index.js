require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const ErrorHandlingMiddleware = require('./middleware/ErrorHandlingMiddleware');
const router = require('./routes/index');
const bcrypt = require('bcrypt');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.options('*', cors({
  origin: '*'
}))

app.use('/', router);

app.use(ErrorHandlingMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    if ((await models.User.count({ where: { role: 'ADMIN' } })) === 0) {
      const hashPassword = await bcrypt.hash('123qwe', 5);
      await models.User.create({ nickname: 'Admin', password: hashPassword, role: 'ADMIN', email: 'admin@mail.ru' })
    }
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}


start();
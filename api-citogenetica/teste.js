const bcrypt = require('bcryptjs');

bcrypt.hash('123', 10).then(hash => console.log(hash));
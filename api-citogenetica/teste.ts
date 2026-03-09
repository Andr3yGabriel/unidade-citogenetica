import bcrypt from 'bcryptjs';

bcrypt.hash('123', 10).then((hash: string) => console.log(hash));
import User, { UserAttributes } from '../models/User';
import UserType from '../models/UserType';

interface UserCreationData {
    completeName: string;
    password_hash: string;
    email: string;
    document: string;
    userTypeId: number;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
}

class UserRepository {
    async createUser(data: UserCreationData): Promise<User> {
        const newUser = await User.create(data);
        return newUser;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const existingUser = await User.findOne({ where: { email } });
        return existingUser;
    }

    async findUserTypeById(userTypeId: number): Promise<UserType | null> {
        const userType = await UserType.findByPk(userTypeId);
        return userType;
    }

    async findUserByDocument(document: string): Promise<User | null> {
        const user = await User.findOne({
            where: { document },
            include: [{ model: UserType, as: 'userType', attributes: ['name'] }]
        });
        return user;
    }

    async findUserById(userId: number): Promise<User | null> {
        const user = await User.findByPk(userId);
        return user;
    }

    async updateUser(user: User, data: Partial<UserAttributes>): Promise<User> {
        await user.update(data);
        return user;
    }
}

export default new UserRepository();
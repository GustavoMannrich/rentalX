import { getRepository, Repository } from 'typeorm';
import { ICreateUserDTO } from '../../../dtos/ICreateUserDTO';
import { User } from '../entities/User';
import { IUsersRepository } from '../../../repositories/IUserRepository';

class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async createOrUpdate({
        id,
        name,
        email,
        driver_license,
        password,
        avatar,
    }: ICreateUserDTO): Promise<void> {
        const user = this.repository.create({
            id,
            name,
            email,
            driver_license,
            password,
            avatar,
        });

        await this.repository.save(user);
    }

    async findByEmail(email: string): Promise<User> {
        return await this.repository.findOne({ email });
    }

    async findById(id: string): Promise<User> {
        return await this.repository.findOne(id);
    }
}

export { UsersRepository };

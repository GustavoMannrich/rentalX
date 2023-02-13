import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { IUsersRepository } from '../../repositories/IUserRepository';

@injectable()
class CreateUserUseCase {
    constructor(
        @inject('UsersRepository') private usersReposistory: IUsersRepository
    ) {}

    async execute({
        name,
        email,
        driver_license,
        password,
    }: ICreateUserDTO): Promise<void> {
        const userAlreadyExists = await this.usersReposistory.findByEmail(
            email
        );

        if (userAlreadyExists) {
            console.log('USER', userAlreadyExists);
            throw new Error('User already exists!');
        }

        const passwordHash = await hash(password, 8);

        await this.usersReposistory.create({
            name,
            email,
            driver_license,
            password: passwordHash,
        });
    }
}

export { CreateUserUseCase };

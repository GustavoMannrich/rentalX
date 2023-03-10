import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let dateProvider: DayjsDateProvider;

describe('Authenticate User', () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });

    it('should be able to authenticate an user', async () => {
        const user: ICreateUserDTO = {
            email: 'user@test.com',
            name: 'User Test',
            password: '1234',
            driver_license: '000123',
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty('token');
    });

    it('should not be able to autheticate an nonexistent user', async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: 'false@email.com',
                password: '1234',
            })
        ).rejects.toEqual(new AppError('Email or password incorrect!'));
    });

    it('should not be able to autheticate an user with invalid password', async () => {
        const user: ICreateUserDTO = {
            email: 'newuser@user.com',
            name: 'User Test Error',
            password: '12345',
            driver_license: '9999',
        };

        await createUserUseCase.execute(user);

        expect(
            authenticateUserUseCase.execute({
                email: user.email,
                password: 'incorrectPassword',
            })
        ).rejects.toEqual(new AppError('Email or password incorrect!'));
    });
});

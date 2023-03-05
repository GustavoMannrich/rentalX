import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';
import { jest } from '@jest/globals';
import { AppError } from '@shared/infra/http/errors/AppError';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe('Send forgot password mail', () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        mailProvider = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider
        );
    });

    it('should be able to send a forgot password mail to the user', async () => {
        const sendMail = jest.spyOn(mailProvider, 'sendMail');

        await usersRepositoryInMemory.createOrUpdate({
            driver_license: '12345',
            email: 'teste@teste.com',
            name: 'Luiz Castro',
            password: '123',
        });

        await sendForgotPasswordMailUseCase.execute('teste@teste.com');

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to send an email if user does not exists', async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute('lalala@teste.com')
        ).rejects.toEqual(new AppError('User does not exists!'));
    });

    it('should be able to create an user token', async () => {
        const generateTokenMail = jest.spyOn(
            usersTokensRepositoryInMemory,
            'create'
        );

        await usersRepositoryInMemory.createOrUpdate({
            driver_license: '5464645',
            email: 'tttttt@teste.com',
            name: 'Mario João',
            password: '123',
        });

        await sendForgotPasswordMailUseCase.execute('tttttt@teste.com');

        expect(generateTokenMail).toBeCalled();
    });
});

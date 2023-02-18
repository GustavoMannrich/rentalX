import { AppError } from '@shared/infra/http/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../repositories/IUserRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository') private usersReposistory: IUsersRepository
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersReposistory.findByEmail(email);

        if (!user) {
            throw new AppError('Email or password incorrect!');
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError('Email or password incorrect!');
        }

        const token = sign({}, '240fee48cfdd0ec9ac6b6876bdef1d4f', {
            subject: user.id,
            expiresIn: '1d',
        });

        const tokenReturn: IResponse = {
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };

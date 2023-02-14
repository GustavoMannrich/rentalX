import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository';

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token missing!', 401);
    }

    // no authHeader, a primeira posição é o Bearer e a segunda é o token
    const [, token] = authHeader.split(' ');

    try {
        const { sub: user_id } = verify(
            token,
            '240fee48cfdd0ec9ac6b6876bdef1d4f'
        ) as IPayload;

        const usersRepository = new UsersRepository();
        const user = await usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User does not exists!', 401);
        }

        // O user foi adicionado na interface do Request no @types/express/index.ts
        request.user = { id: user_id };

        next();
    } catch (error) {
        throw new AppError('Invalid token!', 401);
    }
}

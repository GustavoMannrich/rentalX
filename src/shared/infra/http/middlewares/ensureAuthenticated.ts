import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { UsersRepository } from '../../../../modules/accounts/infra/typeorm/repositories/UsersRepository';
import { UsersTokensRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository';
import auth from '@config/auth';

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;
    const usersTokenRepository = new UsersTokensRepository();

    if (!authHeader) {
        throw new AppError('Token missing!', 401);
    }

    // no authHeader, a primeira posição é o Bearer e a segunda é o token
    const [, token] = authHeader.split(' ');

    try {
        const { sub: user_id } = verify(
            token,
            auth.secret_refresh_token
        ) as IPayload;

        const user = await usersTokenRepository.findByUserIdAndRefreshToken(
            user_id,
            token
        );

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

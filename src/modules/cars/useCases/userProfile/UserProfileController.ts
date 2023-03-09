import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UserProfileUseCase } from './UserProfileUseCase';

class UserProfileController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;
        const profileUserCase = container.resolve(UserProfileUseCase);

        const user = await profileUserCase.execute(id);
        return response.json(user);
    }
}

export { UserProfileController };

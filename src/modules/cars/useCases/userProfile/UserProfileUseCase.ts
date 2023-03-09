import { UserMap } from '@modules/accounts/mapper/UserMap';
import { IUsersRepository } from '@modules/accounts/repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserProfileUseCase {
    constructor(
        @inject('UsersRepository') private usersRepository: IUsersRepository
    ) {}

    async execute(id: string): Promise<IUserReponseDTO> {
        const user = await this.usersRepository.findById(id);

        return UserMap.toDTO(user);
    }
}

export { UserProfileUseCase };

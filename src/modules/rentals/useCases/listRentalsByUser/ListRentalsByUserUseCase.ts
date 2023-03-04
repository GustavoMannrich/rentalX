import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { RentalsRepository } from '@modules/rentals/infra/typeorm/repositories/RentalsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListRentalsByUserUseCase {
    constructor(
        @inject('RentalsRepository')
        private rentalsRepository: RentalsRepository
    ) {}

    async execute(user_id: string): Promise<Rental[]> {
        return await this.rentalsRepository.findByUser(user_id);
    }
}

export { ListRentalsByUserUseCase };

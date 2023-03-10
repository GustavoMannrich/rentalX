import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/infra/http/errors/AppError';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { inject, injectable } from 'tsyringe';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}

dayjs.extend(utc);

@injectable()
class CreateRentalUseCase {
    constructor(
        @inject('RentalsRepository')
        private rentalRepository: IRentalsRepository,
        @inject('DayjsDateProvider') private dateProvider: IDateProvider,
        @inject('CarsRepository') private carsRepository: ICarsRepository
    ) {}

    async execute({
        user_id,
        car_id,
        expected_return_date,
    }: IRequest): Promise<Rental> {
        const minimunHours = 24;

        const carUnavailable = await this.rentalRepository.findOpenRentalByCar(
            car_id
        );

        if (carUnavailable) {
            throw new AppError('Car is unavailable!');
        }

        const rentalOpenToUser =
            await this.rentalRepository.findOpenRentalByUser(user_id);

        if (rentalOpenToUser) {
            throw new AppError('The user already has a rental in progress!');
        }

        const dateNow = this.dateProvider.dateNow();
        const hourDiference = this.dateProvider.compareInHours(
            dateNow,
            expected_return_date
        );

        if (hourDiference < minimunHours) {
            throw new AppError('Invalid return time!');
        }

        const rental = await this.rentalRepository.create({
            user_id,
            car_id,
            expected_return_date,
        });

        await this.carsRepository.updateAvailable(car_id, false);

        return rental;
    }
}

export { CreateRentalUseCase };

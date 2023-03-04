import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/inMemory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '../../../../shared/infra/http/errors/AppError';
import dayjs from 'dayjs';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
    const expected_return_date = dayjs().add(1, 'day').toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );
    });

    it('should be able to create a new rental', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Test',
            description: 'Car test',
            daily_rate: 100,
            license_plate: 'test',
            fine_amount: 40,
            category_id: '1234',
            brand: 'brand',
        });

        const rental = await createRentalUseCase.execute({
            user_id: '12345',
            car_id: car.id,
            expected_return_date,
        });

        expect(rental).toHaveProperty('id');
        expect(rental).toHaveProperty('start_date');
    });

    it('should not be able to create two rentals for the same user', async () => {
        await rentalsRepositoryInMemory.create({
            car_id: '1111',
            expected_return_date,
            user_id: '12345',
        });

        expect(
            createRentalUseCase.execute({
                user_id: '12345',
                car_id: '222222',
                expected_return_date,
            })
        ).rejects.toEqual(
            new AppError('The user already has a rental in progress!')
        );
    });

    it('should not be able to create two rentals for the same car', async () => {
        await rentalsRepositoryInMemory.create({
            car_id: 'test',
            expected_return_date,
            user_id: '12345',
        });

        expect(
            createRentalUseCase.execute({
                user_id: '321',
                car_id: 'test',
                expected_return_date,
            })
        ).rejects.toEqual(new AppError('Car is unavailable!'));
    });

    it('should not be able to create a new rental with invalid return time', async () => {
        expect(
            createRentalUseCase.execute({
                user_id: '123',
                car_id: '121212',
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppError('Invalid return time!'));
    });
});

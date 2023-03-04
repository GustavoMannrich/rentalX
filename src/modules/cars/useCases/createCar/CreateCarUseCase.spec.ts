import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/infra/http/errors/AppError';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carRepository: CarsRepositoryInMemory;

describe('Create Car', () => {
    beforeEach(() => {
        carRepository = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carRepository);
    });

    it('should be able to create a new car', async () => {
        const car = await createCarUseCase.execute({
            name: 'Car Name',
            description: 'Car description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        expect(car).toHaveProperty('id');
    });

    it('should not be able to create a car with duplicate license plate', async () => {
        await createCarUseCase.execute({
            name: 'Car1',
            description: 'Car description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        expect(
            createCarUseCase.execute({
                name: 'Car2',
                description: 'Car description',
                daily_rate: 100,
                license_plate: 'ABC-1234',
                fine_amount: 60,
                brand: 'Brand',
                category_id: 'category',
            })
        ).rejects.toEqual(new AppError('Car already exists!'));
    });

    it('should not be able to create a car with "available" true by default', async () => {
        const car = await createCarUseCase.execute({
            name: 'Car Available',
            description: 'Car description',
            daily_rate: 100,
            license_plate: 'ABC-5678',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        expect(car.available).toBe(true);
    });
});

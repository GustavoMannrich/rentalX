import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { ListCarsUseCase } from './ListCarsUseCase';

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Cars', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
    });

    it('should be able to list all available cars', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Audi A1',
            license_plate: 'DEF-9999',
            fine_amount: 40,
            description: 'Carro legal',
            daily_rate: 110.0,
            category_id: 'category_id',
            brand: 'Audi',
        });

        const cars = await listCarsUseCase.execute();

        expect(cars).toEqual([car]);
    });

    it('should be able to list all available cars by name', () => {});
});

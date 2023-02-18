import { AppError } from '../../../../shared/infra/http/errors/AppError';
import { CategoriesRepositoryInMemory } from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create Category', () => {
    beforeAll(() => {
        categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
        createCategoryUseCase = new CreateCategoryUseCase(
            categoriesRepositoryInMemory
        );
    });

    it('should be able to create a new category', async () => {
        const category = {
            name: 'Category Test',
            description: 'Category Description Test',
        };

        await createCategoryUseCase.execute(category);

        const categoryCreated = await categoriesRepositoryInMemory.findByName(
            category.name
        );

        expect(categoryCreated).toHaveProperty('id');
    });

    it('should not be able to create categories with duplicate names', async () => {
        expect(async () => {
            const category = {
                name: 'Category Test',
                description: 'Category Description Test',
            };

            await createCategoryUseCase.execute(category);

            const categoryCreated =
                await categoriesRepositoryInMemory.findByName(category.name);

            expect(categoryCreated).toHaveProperty('id');
        }).rejects.toBeInstanceOf(AppError);
    });
});

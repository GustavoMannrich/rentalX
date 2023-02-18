import { container } from 'tsyringe';
import { SpecificationsRepository } from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { IUsersRepository } from '@modules/accounts/repositories/IUserRepository';
import { CategoriesRepository } from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';

// Especifica que o CategoriesRepository é um singleton
container.registerSingleton<ICategoriesRepository>(
    'CategoriesRepository',
    CategoriesRepository
);

// Especifica que o SpecificationsRepository é um singleton
container.registerSingleton<ISpecificationsRepository>(
    'SpecificationsRepository',
    SpecificationsRepository
);

// Especifica que o UserRepository é um singleton
container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository
);

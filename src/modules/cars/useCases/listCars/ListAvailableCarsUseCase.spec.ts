import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Audi A1",
      license_plate: "DEF-9999",
      fine_amount: 40,
      description: "Carro legal",
      daily_rate: 110.0,
      category_id: "category_id",
      brand: "Audi",
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Prisma",
      license_plate: "DEF-8888",
      fine_amount: 40,
      description: "Carro legal",
      daily_rate: 110.0,
      category_id: "category_id",
      brand: "Chevrolet",
    });

    const cars = await listCarsUseCase.execute({
      brand: "Chevrolet",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Corolla",
      license_plate: "DEF-7777",
      fine_amount: 40,
      description: "Carro legal",
      daily_rate: 110.0,
      category_id: "category_id",
      brand: "Toyota",
    });

    const cars = await listCarsUseCase.execute({
      name: "Corolla",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Pulse",
      license_plate: "DEF-6666",
      fine_amount: 40,
      description: "Carro legal",
      daily_rate: 110.0,
      category_id: "12345",
      brand: "Fiat",
    });

    const cars = await listCarsUseCase.execute({
      category_id: "12345",
    });

    expect(cars).toEqual([car]);
  });
});

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listCars/ListAvailableCarsController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImage/UploadCarImagesController';
import { Router } from 'express';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import uploadConfig from '../../../../config/upload';
import multer from 'multer';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarsSpecificationController =
    new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();

const upload = multer(uploadConfig);

carsRoutes.post(
    '/',
    ensureAuthenticated,
    ensureAdmin,
    createCarController.handle
);

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.post(
    '/specifications/:id',
    ensureAuthenticated,
    ensureAdmin,
    createCarsSpecificationController.handle
);

carsRoutes.post(
    '/images/:id',
    ensureAuthenticated,
    ensureAdmin,
    upload.array('images'),
    uploadCarImagesController.handle
);

export { carsRoutes };

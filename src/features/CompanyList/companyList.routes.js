import express from 'express';
import CompanyListController from './companyList.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

const companyListRouter = express.Router();

const companyListController = new CompanyListController();

companyListRouter.get('/filter', jwtAuth, (req, res, next) => {
    companyListController.filterComp(req, res, next)
})

companyListRouter.get('/', jwtAuth, (req, res, next) => {
    companyListController.getAll(req, res, next)
})

companyListRouter.get('/check', (req, res, next) => {
    companyListController.checkCompany(req, res, next)
})

companyListRouter.post('/', (req, res, next) => {
    companyListController.addComp(req, res, next)
})

companyListRouter.put('/', (req, res, next) => {
    companyListController.update(req, res, next)
})

companyListRouter.delete('/', (req, res, next) => {
    companyListController.delete(req, res, next)
})

export default companyListRouter;

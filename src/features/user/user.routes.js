// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

// 2. Initialize Express router.
const userRouter = express.Router();

const userController = new UserController();

// All the paths to controller methods.

userRouter.get('/getall', (req, res, next) => {
    userController.getAllUsers(req, res, next)
})
userRouter.get('/me', jwtAuth, (req, res, next) => {
    userController.getCurrentUser(req, res, next)
})



userRouter.post('/signup', (req, res, next) => {
    userController.signUp(req, res, next)
});
userRouter.post('/signin', (req, res, next) => {
    userController.signIn(req, res, next)
});

userRouter.get('/verify/:token', (req, res, next) => {
    userController.verify(req, res, next)
});

userRouter.delete('/:id', jwtAuth, (req, res, next) => {
    userController.deleteUser(req, res, next)
});

// userRouter.put('/resetPassword', jwtAuth, (req, res, next)=>{
//     userController.resetPassword(req, res, next)
// });

export default userRouter;

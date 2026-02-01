import { Router } from "express";

const userRouter = Router();

userRouter.get('/', (req, res) => {
    // Handle fetching get all users
    res.send({ title: 'Get all users endpoint' });
});

userRouter.get('/:id', (req, res) => {
    // Handle fetching a specific user by ID
    res.send({ title: 'Get user by ID endpoint' });
});

userRouter.post('/', (req, res) => {
    // Handle creating a new user
    res.send({ title: 'Create new user endpoint' });
});

userRouter.put('/:id', (req, res) => {
    // Handle updating an existing user
    res.send({ title: 'Update existing user endpoint' });
});

userRouter.delete('/:id', (req, res) => {
    // Handle deleting an existing user
    res.send({ title: 'Delete existing user endpoint' });
});

export default userRouter;
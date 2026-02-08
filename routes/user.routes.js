import { Router } from "express";
// import { getUser, getUsers } from "../controllers/user.controller.js";
// import { getUser, getUsers } from "../controllers/user.controller";
import { getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', getUser);

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
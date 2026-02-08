import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// what is req body ? => req.body contains the data sent by the client in the request body, typically in JSON format. It is used to send data to the server, such as user credentials during sign-up or sign-in.

// export const signUp = async (req, res, next) => {
//     // Implementation for user sign-up
//     // session of mongose session for transaction
//     // ATOMIC OPERATION
//     const session = await mongoose.startSession();
//     try {
//         // LOGIC FOR SIGN UP
//         const { name, email, password } = req.body;
//         // check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             const error = new Error('User already exists');
//             error.status = 409;
//             throw error;
//         }
//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         // Create new user
//         const newUser = await User.create([{ name, email, password: hashedPassword }], { session });
//         const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

//         res.status(201).json({
//             success: true, message: 'User created successfully',
//             data: {
//                 token,
//                 user: { id: newUser[0]._id, name: newUser[0].name, email: newUser[0].email }
//             }
//         });
//         await newUser.save({ session });
//         await session.commitTransaction();
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         next(error);
//     }

// }

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        //A transaction is a group of database operations that are treated as one single unit. 
        // This means that either all operations in the transaction are executed successfully, 
        // or none of them are applied to the database. Transactions help maintain data integrity and consistency, 
        // especially in scenarios where multiple related operations need to be performed together. 
        // If any operation within the transaction fails, the entire transaction can be rolled back, 
        // ensuring that the database remains in a consistent state.

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            const error = new Error("User already exists");
            error.status = 409;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        //bcrypt is a library used to securely store passwords. 
        // It provides a way to hash passwords before storing them in the database, 
        // making it difficult for attackers to retrieve the original password even if they gain access to the database.
        // The bcrypt algorithm incorporates a salt (random data) and multiple rounds of hashing to enhance security.

        const [newUser] = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            }
        });
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        next(error);
    }
};


export const signIn = async (req, res, next) => {
    // Implementation for user sign-in
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.status = 401;
            throw error;
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user,
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    // Implementation for user sign-out
    try {
    } catch (error) {
        next(error);
    }
}
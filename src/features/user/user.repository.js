import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";


export const UserModel = mongoose.model('User', userSchema);

export default class UserRepository {

    async signUp(user) {
        try {
            const existingUser = await UserModel.findOne({ email: user.email });
            // create instance of model.
            if (!existingUser) {
                const newUser = new UserModel(user);
                const savedUser = await newUser.save();
                return savedUser;
            } else {
                return { error: "User exists" };
            }

        }
        catch (err) {
            console.log(err);
            throw new Error("Something went wrong with database");
        }
    }

    async signIn(email, password) {
        try {
            const user = await UserModel.findOne({ email, password });
            return user
        }
        catch (err) {
            console.log(err);
            throw new Error("Something went wrong with database");
        }
    }

    async signupUpdate(userId) {
        try {
            // Update the user's verified status to true
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { verified: true },
                { new: true }
            );
            return user;
        } catch (err) {
            console.log(err);
            throw new Error("Something went wrong with the database");
        }
    }

    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            console.log(err);
            throw new Error("Something went wrong with database");
        }
    }

    async findUser(userId) {
        try {
            const user = await UserModel.findById(userId).select('-password');
            if (!user) {
                return { error: 'User not found', status: 404 };
            }
            return user;
        } catch (err) {
            console.log(err);
            throw new Error("Something went wrong with database");
        }
    }

    async getAll(userId) {
        try {
            const userAdmin = await UserModel.findById(userId);

            if (!userAdmin) {
                return { error: "User not found" };
            }

            if (userAdmin.isAdmin) {
                const users = await UserModel.find();
                return users;
            } else {
                return { error: "you are not the admin to perform the task" }
            }

        } catch (err) {
            console.log(err);
            throw new Error("Something went wrong with database");
        }
    }

    async delete(id, userId) {
        try {
            const user = await UserModel.findById(userId);
            if (user.isAdmin == true) {
                const query = {
                    _id: new mongoose.Types.ObjectId(id)
                }
                await UserModel.findOneAndDelete(query);
                return { message: "User deleted successfully" };
            } else {
                return { error: "You are not the admin to do the task" };
            }
        } catch (err) {
            console.log(err);
            throw new Error("Something went wrong with database");
        }
    }
}
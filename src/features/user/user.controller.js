import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }


    async signUp(req, res, next) {
        const { name, email, password } = req.body;
        try {
            const existingUser = await this.userRepository.findByEmail(email);

            // Check if the user exists and is unverified
            if (existingUser) {
                if (!existingUser.verified) {
                    // Resend verification email logic here
                    const verificationToken = jwt.sign(
                        { userID: existingUser._id },
                        process.env.JWT_SECRET,
                        { expiresIn: '30d' }
                    );

                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
                    });

                    const verificationLink = `https://companieslisting-b.onrender.com/api/user/verify/${verificationToken}`;
                    await transporter.sendMail({
                        to: email,
                        subject: "Verify your email",
                        html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`
                    });

                    return res.status(200).send({ message: "Verification email resent." });
                }

                // User exists and is already verified, send appropriate response
                return res.status(400).json({ error: "User already verified." });
            }

            // If no unverified user exists, continue with the signup process
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = { name, email, password: hashedPassword, verified: false };

            const savedUser = await this.userRepository.signUp(user);
            if (savedUser.error) {
                return res.status(400).json({ error: savedUser.error });
            }

            const verificationToken = jwt.sign(
                { userID: savedUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
            });

            const verificationLink = `https://companieslisting-b.onrender.com/api/user/verify/${verificationToken}`;
            await transporter.sendMail({
                to: email,
                subject: "Verify your email",
                html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`
            });

            return res.status(201).send({ message: "User registered successfully. Verification email sent." });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


    async signIn(req, res, next) {
        try {
            // 1. Find user by email.
            const { email, password } = req.body;
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return res
                    .status(401)
                    .send('Incorrect email');
            }

            if (!user.verified) {
                return res.status(403).json({ error: 'Email not verified. Please verify your email first.' });
            }

            // 2. Compare password with hashed password.
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // 3. Create token.
                const token = jwt.sign(
                    {
                        userID: user._id,
                        // email: user.email,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '30d',
                    }
                );
                // 4. Send token.
                return res.status(200).send({ token });
            } else {
                return res
                    .status(401)
                    .json({ error: 'Incorrect Credentials' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async verify(req, res, next) {
        const { token } = req.params;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // console.log("decoded :", decoded);

            const result = await this.userRepository.signupUpdate(decoded.userID);

            if (result) {
                res.status(200).send("Email verified successfully. You can now log in.");
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const userId = req.userID;
            console.log("userId :", userId);
            const user = await this.userRepository.findUser(userId);
            return res.status(200).send({ user });
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const userId = req.userID;
            const users = await this.userRepository.getAll(userId);

            if (users.error) {
                return res.status(403).json({ error: users.error });
            }

            // console.log(users);
            return res.status(200).send({ users });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const userId = req.userID;
            const id = req.params.id;
            const user = await this.userRepository.delete(id, userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).send(user);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

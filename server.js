import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import companyListRouter from "./src/features/CompanyList/companyList.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";

const server = express();

// Middleware
server.use(express.json());

dotenv.config();

// CORS policy configuration
server.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        // 'http://localhost:3000'
        '*'
    );
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // return ok for preflight request.
    if (req.method == 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// routes
server.use('/api/user', userRouter);
server.use('/api/company', companyListRouter);

server.listen(3200, () => {
    console.log("Server is running at 3200")
    connectUsingMongoose();
})
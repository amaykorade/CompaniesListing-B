import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtAuth = (req, res, next) => {
    // 1. Read the token.
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // const token = authHeader;
    console.log("token: ", token);
    // 2. if no token, return the error.
    if (!token) {
        return res.status(401).send({ error: 'Unauthorized: No token provided' });
    }
    // 3. check if token is valid.
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        console.log("payload :", payload)
        req.userID = payload.userID;
        // 5. call next middleware
        next();
    } catch (err) {
        // 4. return error.
        console.log(err);
        return res.status(401).send({ error: 'Unauthorized: Invalid token' });
    }

};

export default jwtAuth;



// import jwt from 'jsonwebtoken';

// const jwtAuth = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) return res.status(401).json({ error: "Unauthorized, token required" });

//     try {
//         const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//         req.userID = decoded.userID;
//         next();
//     } catch (err) {
//         res.status(403).json({ error: "Invalid token" });
//     }
// };

// export default jwtAuth;


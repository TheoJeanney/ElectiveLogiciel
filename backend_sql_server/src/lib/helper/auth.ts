import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    if (token && process.env.ACCESSTOKENSECRET) {
      jwt.verify(
        token,
        process.env.ACCESSTOKENSECRET,
        (err: any, user: any) => {
          if (err) {
            return res.sendStatus(403);
          }

          req.user = user;
          next();
        }
      );
    } else {
      return res.sendStatus(403).send('No token provided');
    }
  } else {
    res.sendStatus(401);
  }
};

import * as express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getFewUsers,
  getUser,
  updateUser,
} from '../controllers/UserController';
import { IUser } from '../interfaces/IUser';
import { authenticateJWT } from '../lib/helper/auth';
import jwt from 'jsonwebtoken';

const router = express.Router();

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

const users = [
  {
    username: 'john',
    password: 'password123admin',
    roleId: 'admin',
  },
  {
    username: 'anna',
    password: 'password123member',
    roleId: 'technique',
  },
  {
    username: 'jane',
    password: 'password123member',
    email: 'jane@gmail.fr',
    roleId: 'commercial',
  },
];

router.get('/', authenticateJWT, async (req, res, next) => {
  const user = await getAllUsers();
  res.json(user);
});

router.post('/login', (req, res) => {
  // read username and password from request body
  const { email, password, roleId } = req.body;

  // filter user from the users array by username and password
  const user = users.find(u => {
    return (
      u?.email === email &&
      u.password === password &&
      u.roleId === roleId.toLowerCase()
    );
  });

  if (user) {
    // generate an access token
    const accessToken = jwt.sign(
      { username: user.username, role: user.roleId },
      accessTokenSecret,
      { expiresIn: '20m' }
    );
    const refreshToken = jwt.sign(
      { username: user.username, role: user.roleId },
      refreshTokenSecret
    );

    refreshTokens.push(refreshToken);

    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } else {
    res.status(404).send('Username or password incorrect');
  }
});

router.post('/create', authenticateJWT, async (req, res, next) => {
  try {
    const userInput: IUser = req.body;
    console.log(userInput);

    const user = await createUser(userInput);
    res.json(user);
  } catch (err: any) {
    if (err.meta.field_name == 'User_roleId_fkey (index)')
      res.json("User's role not found");
    else if (err.meta.target == 'User_email_key')
      res.json('User already exists');
    else res.json('Error when creating the user');
  }
});

router.get('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

router.put('/:id', authenticateJWT, async (req, res, next) => {
  try {
    console.log(req.body);

    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

//get only 10 users
router.get('/:nbr/:skip', authenticateJWT, async (req, res, next) => {
  try {
    const user = await getFewUsers(
      parseInt(req.params.nbr),
      parseInt(req.params.skip)
    );
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

router.delete('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);

    res.json(user);
  } catch (err) {
    res.json('User does not exist');
  }
});

module.exports = router;

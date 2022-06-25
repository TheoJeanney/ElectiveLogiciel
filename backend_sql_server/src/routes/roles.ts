import * as express from 'express';
import {
  createRole,
  deleteRole,
  getAllRoles,
  getFewRoles,
  getRole,
  updateRole,
} from '../controllers/RoleController';
import { authenticateJWT } from '../lib/helper/auth';

const router = express.Router();

router.get('/', authenticateJWT, async (req, res, next) => {
  console.log('Get all roles');

  const roles = await getAllRoles();
  res.json(roles);
});

router.post('/create', authenticateJWT, async (req, res, next) => {
  try {
    const userInput = req.body;
    const user = await createRole(userInput);
    res.json(user);
  } catch (err: any) {
    if (err.meta.target == 'Role_name_key') res.json('Role already exists');
    else res.json('Error when creating a role');
  }
});

router.get('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const role = await getRole(req.params.id);
    res.json(role);
  } catch (err) {
    res.json('Role not found');
  }
});

router.put('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const user = await updateRole(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

router.get('/:nbr/:skip', authenticateJWT, async (req, res, next) => {
  try {
    const roles = await getFewRoles(
      parseInt(req.params.nbr),
      parseInt(req.params.skip)
    );
    res.json(roles);
  } catch (err) {
    res.json(err);
  }
});

router.delete('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const user = await deleteRole(req.params.id);
    res.json(user);
  } catch (err) {
    res.json('Role does not exist');
  }
});

module.exports = router;

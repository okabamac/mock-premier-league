import { Router } from 'express';
import userCtrl from '../controllers/user.ctrl';
import auth from '../middlewares/auth';
import bodyValidation from '../middlewares/validation/bodyValidation';

const router = Router();

router
  .post('/admin/signup', [auth.authenticate, auth.isAdmin, bodyValidation], userCtrl.add)
  .post('/regular/signup', [bodyValidation], userCtrl.add)
  .post('/signin', [bodyValidation], userCtrl.login);

export default router;

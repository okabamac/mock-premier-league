import { Router } from 'express';
import teamCtrl from '../controllers/team.ctrl';
import auth from '../middlewares/auth';
import bodyValidation from '../middlewares/validation/bodyValidation';
import paramValidation from '../middlewares/validation/paramValidation';

const router = Router();

router
  .post('/add', [auth.authenticate, auth.isAdmin, bodyValidation], teamCtrl.add)
  .delete(
    '/:team_id',
    [auth.authenticate, auth.isAdmin, paramValidation],
    teamCtrl.remove,
  )
  .get(
    '/:team_id',
    [paramValidation],
    teamCtrl.getATeam,
  )
  .get('/', teamCtrl.getAllTeam)
  .put('/edit/:team_id', [auth.authenticate, auth.isAdmin, paramValidation, bodyValidation], teamCtrl.editTeam);

export default router;

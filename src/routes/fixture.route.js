import { Router } from 'express';
import fixtureCtrl from '../controllers/fixture.ctrl';
import auth from '../middlewares/auth';
import bodyValidation from '../middlewares/validation/bodyValidation';
import paramValidation from '../middlewares/validation/paramValidation';

const router = Router();

router
  .post('/create', [auth.authenticate, auth.isAdmin, bodyValidation], fixtureCtrl.add)
  .delete('/:fixture_id', [auth.authenticate, auth.isAdmin, paramValidation], fixtureCtrl.remove)
  .get(
    '/:fixture_id',
    [paramValidation],
    fixtureCtrl.getAFixture,
  )
  .get('/', fixtureCtrl.getAllFixture)
  .put('/edit/:fixture_id', [auth.authenticate, auth.isAdmin, paramValidation, bodyValidation], fixtureCtrl.editFixture);

export default router;

import FixtureService from '../services/fixture.service';
import ResponseGenerator from '../utils/response.generator';

const response = new ResponseGenerator();

class FixtureController {
  /**
   * @param {object} request express request object
   * @param {object} response express request object
   * @returns {json} json
   * @memberof FixtureController
   */

  static async add(req, res) {
    try {
      const fixture = await FixtureService.addFixture(req);
      if (fixture) {
        return response.sendSuccess(res, 200, fixture);
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  }

  static async remove(req, res) {
    try {
      const fixture = await FixtureService.removeFixture(req);
      if (fixture) {
        return response.sendSuccess(
          res,
          200,
          fixture,
          'Fixture successfully deleted',
        );
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 404, err.message);
    }
  }

  static async getAFixture(req, res) {
    try {
      const fixture = await FixtureService.getAFixture(req);
      if (fixture) {
        return response.sendSuccess(res, 200, fixture);
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 404, err.message);
    }
  }

  static async getAllFixture(req, res) {
    try {
      const fixture = await FixtureService.getAllFixture(req);
      if (fixture) {
        return response.sendSuccess(res, 200, fixture);
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  }

  static async editFixture(req, res) {
    try {
      const fixture = await FixtureService.editFixture(req);
      if (fixture) {
        return response.sendSuccess(res, 200, fixture, 'Fixture successfully edited');
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  }
}

export default FixtureController;

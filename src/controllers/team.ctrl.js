import TeamService from '../services/team.service';
import ResponseGenerator from '../utils/response.generator';

const response = new ResponseGenerator();

class TeamController {
  /**
   * @param {object} request express request object
   * @param {object} response express request object
   * @returns {json} json
   * @memberof TeamController
   */

  static async add(req, res) {
    try {
      const team = await TeamService.addTeam(req);
      if (team) {
        return response.sendSuccess(res, 200, team);
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  }

  static async remove(req, res) {
    try {
      const team = await TeamService.removeTeam(req);
      if (team) {
        return response.sendSuccess(res, 200, team, 'Team successfully deleted');
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 404, err.message);
    }
  }

  static async getATeam(req, res) {
    try {
      const team = await TeamService.getATeam(req);
      if (team) {
        return response.sendSuccess(res, 200, team);
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 404, err.message);
    }
  }

  static async getAllTeam(req, res) {
    try {
      const team = await TeamService.getAllTeam(req);
      if (team) {
        return response.sendSuccess(res, 200, team);
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  }

  static async editTeam(req, res) {
    try {
      const team = await TeamService.editTeam(req);
      if (team) {
        return response.sendSuccess(res, 200, team, 'Team successfully edited');
      }
      return response.sendError(res, 500, 'Something went wrong');
    } catch (err) {
      return response.sendError(res, 400, err.message);
    }
  }
}

export default TeamController;

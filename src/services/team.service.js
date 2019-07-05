/* eslint-disable camelcase */
import Team from '../models/team.model';

class TeamService {
  /** Add team to the db
   * @description Operate on a team
   * @param {object} a new team object
   */

  static async addTeam(req) {
    try {
      const foundTeam = await Team.filter(
        team => team.team_name === req.body.team_name,
      )[0];
      if (foundTeam) {
        throw new Error('Team name is already registered');
      }
      const {
        team_name,
        motto,
        major_trophies,
        location,
        year_founded,
        current_manager,
      } = req.body;
      const newTeam = {
        team_id: Team.length + 1,
        team_name,
        location,
        year_founded,
        current_manager,
        major_trophies,
        motto,
      };
      await Team.push(newTeam);
      return {
        team_id: newTeam.team_id,
        team_name,
        location,
        year_founded,
        current_manager,
        major_trophies,
        motto,
      };
    } catch (err) {
      throw err;
    }
  }

  static async removeTeam(req) {
    try {
      const foundTeam = await Team.filter(
        team => team.team_id === Number(req.params.team_id),
      )[0];
      if (!foundTeam) {
        throw new Error('This team does not exist');
      }
      // remove team
      await Team.splice(Team.indexOf(foundTeam), 1);
      return foundTeam;
    } catch (err) {
      throw err;
    }
  }

  static async editTeam(req) {
    try {
      const foundTeam = await Team.filter(
        team => team.team_id === Number(req.params.team_id),
      )[0];
      if (!foundTeam) {
        throw new Error('This team does not exist');
      }
      const {
        team_name,
        motto,
        major_trophies,
        location,
        year_founded,
        current_manager,
      } = req.body;
      await Object.assign(foundTeam, {
        team_name: team_name || foundTeam.team_name,
        motto: motto || foundTeam.motto,
        major_trophies: major_trophies || foundTeam.major_trophies,
        location: location || foundTeam.location,
        year_founded: year_founded || foundTeam.year_founded,
        current_manager: current_manager || foundTeam.current_manager,
      }); // this mutates
      return foundTeam;
    } catch (err) {
      throw err;
    }
  }

  static async getATeam(req) {
    try {
      const foundTeam = await Team.filter(
        team => team.team_id === Number(req.params.team_id),
      )[0];
      if (!foundTeam) {
        throw new Error('This team is not registered');
      }
      return foundTeam;
    } catch (err) {
      throw err;
    }
  }

  static async getAllTeam(req) {
    try {
      return Team;
    } catch (err) {
      throw err;
    }
  }
}

export default TeamService;

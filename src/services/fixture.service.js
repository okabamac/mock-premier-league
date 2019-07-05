/* eslint-disable camelcase */
import Fixture from '../models/fixture.model';

class FixtureService {
  /** Add fixture to the db
   * @description Operate on a fixture
   * @param {object} a new fixture object
   */

  static async addFixture(req) {
    try {
      const foundFixture = await Fixture.filter(
        fixture => fixture.team_A === req.body.team_A && fixture.team_B === req.body.team_B && fixture.date.getTime() === req.body.date.getTime(),
      )[0];
      if (foundFixture) {
        throw new Error('There is already a scheduled fixture between the teams on that date');
      }
      const {
        team_A,
        team_B,
        venue,
        date,
        time,
        status,
      } = req.body;
      const newFixture = {
        fixture_id: Fixture.length + 1,
        team_A,
        team_B,
        venue,
        date,
        time,
        status,
        scores: '0-0',
      };
      await Fixture.push(newFixture);
      return {
        fixture_id: newFixture.fixture_id,
        team_A,
        team_B,
        venue,
        date,
        time,
        status,
      };
    } catch (err) {
      throw err;
    }
  }

  static async removeFixture(req) {
    try {
      const foundFixture = await Fixture.filter(
        fixture => fixture.fixture_id === Number(req.params.fixture_id),
      )[0];
      if (!foundFixture) {
        throw new Error('This fixture does not exist');
      }
      // remove fixture
      await Fixture.splice(Fixture.indexOf(foundFixture), 1);
      return foundFixture;
    } catch (err) {
      throw err;
    }
  }

  static async editFixture(req) {
    try {
      const foundFixture = await Fixture.filter(
        fixture => fixture.fixture_id === Number(req.params.fixture_id),
      )[0];
      if (!foundFixture) {
        throw new Error('This fixture does not exist');
      }
      const {
        team_A,
        team_B,
        venue,
        date,
        time,
        status,
        scores,
      } = req.body;
      await Object.assign(foundFixture, {
        team_A: team_A || foundFixture.team_A,
        team_B: team_B || foundFixture.team_B,
        venue: venue || foundFixture.venue,
        date: date || foundFixture.date,
        time: time || foundFixture.time,
        status: status || foundFixture.status,
        scores: scores || foundFixture.scores,
      }); // this mutates
      return foundFixture;
    } catch (err) {
      throw err;
    }
  }

  static async getAFixture(req) {
    try {
      const foundFixture = await Fixture.filter(
        fixture => fixture.fixture_id === Number(req.params.fixture_id),
      )[0];
      if (!foundFixture) {
        throw new Error('This fixture does not exist');
      }
      return foundFixture;
    } catch (err) {
      throw err;
    }
  }

  static async getAllFixture(req) {
    try {
      if (req.query.status) {
        const foundFixture = await Fixture.filter(
          fixture => fixture.status === req.query.status,
        )[0];
        if (!foundFixture) {
          throw new Error(`No ${req.query.status} fixtures`);
        }
        return foundFixture;
      }
      return Fixture;
    } catch (err) {
      throw err;
    }
  }
}

export default FixtureService;

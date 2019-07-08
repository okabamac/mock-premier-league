import connectionManager from '../../db.manager';

describe('MongoDB Connections', () => {
  test('Should fail when env not test ', () => {
    expect(process.env.NODE_ENV).toEqual('test');
  });
  test('Should fail when trying to start real mongo connection in test env ', async () => {
    await connectionManager.start();
    expect(process.env.NODE_ENV).toEqual('test');
  });
  test('Should fail when trying to stop real mongo connection in test env ', async () => {
    await connectionManager.stop();
    expect(process.env.NODE_ENV).toEqual('test');
  });
});

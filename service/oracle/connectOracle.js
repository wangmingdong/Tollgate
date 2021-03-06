import oracledb from 'oracledb';
import oracleService from '../../config/application';

class ConnectOracle {

  constructor() {
    this.connectionAttrs = {
      user: oracleService.userName,
      password: oracleService.password,
      connectString: oracleService.connectUrl
    };
    this.releaseConnections = this.releaseConnections.bind(this);
  }

  executeSql (sql){
    oracledb.autoCommit = true;
    return new Promise((resolve, reject) => {
      oracledb
        .getConnection(this.connectionAttrs)
        .then(connection => {
          return connection
            .execute(sql)
            .then(results => {
              resolve(results);
              this.releaseConnections(connection);
            })
            .catch(err => {
              reject(err);
              this.releaseConnections(connection)
            })
        })
        .catch(err => {
          reject(err)
        })
    })}

  releaseConnections(resultSet, connection){
    process.nextTick(() => {
      if (resultSet) {
        resultSet
          .close()
          .then(() => {
            connection
              .release()
              .catch(err => {
                throw err
              })
          })
          .catch(err => {
            throw err
          })
      } else {
        connection
          .release()
          .catch(err => {
            throw err
          })
      }
    })
  }
}

export default ConnectOracle;

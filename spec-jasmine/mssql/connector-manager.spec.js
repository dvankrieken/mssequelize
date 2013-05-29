var config    = require("../config/config")
  , Sequelize = require("../../index")
  , sequelize = new Sequelize(config.mssql.database, config.mssql.username, config.mssql.password, { pool: config.mssql.pool, logging: false, host: config.mssql.host, port: config.mssql.port })
  , Helpers   = new (require("../config/helpers"))(sequelize)

describe('ConnectorManager', function() {
  beforeEach(function() {
    Helpers.dropAllTables()
  })

  afterEach(function() {
    Helpers.dropAllTables()
  })

  it('works correctly after being idle', function() {
    var User = sequelize.define('User', { username: Sequelize.STRING })

    Helpers.async(function(done) {
      User.sync({force: true}).on('success', function() {
        User.create({username: 'user1'}).on('success', function() {
          User.count().on('success', function(count) {
            expect(count).toEqual(1)
            done()
          })
        })
      })
    })

    Helpers.async(function(done) {
      setTimeout(function() {
        User.count().on('success', function(count) {
          expect(count).toEqual(1)
          done()
        })
      }, 1000)
    })
  })
})

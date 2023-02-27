module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'kozbara',
  password: '1234',
  database: 'postgres',
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

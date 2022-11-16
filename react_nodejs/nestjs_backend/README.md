# FAMILY TRACKER API

## Startup

- Install dependencies
  ```
  yarn install
  or
  npm install
  ```

- Run the api
  ```
  nest start --watch
  ```

## Database
NestJS [*does not*](https://stackoverflow.com/questions/65886528/typeorm-create-database-migration) have the capability to create the db on its own. A Docker setup is required prior to releasing the app to production
### Migrations
- Create new: 
```
npm run new-migration --name=NameOfMigration
```

- Run pending migrations:
```
npm run migrations
```
## Documentation

## Notes

## TODO
- update entities with any missing columns
- REDO migrations, including table names
- setup docker
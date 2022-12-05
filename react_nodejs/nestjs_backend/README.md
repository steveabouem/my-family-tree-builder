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
- Revert migrations:
```
npm run revert-migrations
```

## Documentation

## Notes

## TODO
- figure out how to pass user session for create functions
-  is there a way to pass an arguments in embedded entities in case I need a column to be non nullable?
- you might need to write migrations to drop that `recordCreatedById` column in task (seems like creating the relation is creating this new column)
- why was embedding not allowing inserts when default values were provided?
- update entities with any missing columns
- do migrations, if necessary
- setup docker
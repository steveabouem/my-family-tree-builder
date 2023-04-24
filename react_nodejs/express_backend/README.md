# `PROJECT STRUCTURE`
 
## Family tree: `APP #1`
All routes and entities are prefixed by `FT`. They are seggragated from the others for now.

## Tracker Management: `APP #2`
For the time being, given that the family tree requirement came along as the project was already under way.

# `CODING STRUCTURE`

## Naming conventions (WIP)
- Types: `DTypeName`
- Functions arguments: `p_arg`
- Generics: `GTypeName`
- Sql statement variables: `const select/insert/update/delete`
- Queries: prioritize Sequelize, outside of Base classes (this is mainly because of automaticly generated associations get - set functions). `result` for single record, `results` for arrays
- Variables for models in controller/services: const current... = fetchDataOnCurrentlyDisplayedModel, const target... = fe  tchAnotherRecord
- Booleans/validations: const `variableValid` = ...;
- Snake vs Camel: db fields and DTOS (for mapping in queries): snake, functions args: snake,  `everything else: camel`
### Dates
Created with 
```
new Date().toUTCString()
```

## Models
Define the attributes for each entity, as well as the related table
- **Typing**: see sequelize docs
(https://sequelize.org/docs/v6/other-topics/typescript/ to switch models to TS)
<!-- ## Controllers REMOVED
Define the basic getters/setters for each entity, and provide those capabilities to the related service. I.E: the service receives the params and performs the queries, and if necessary the business logic. `NO QUERIES IN CONTROLLER` -->

- **Typing**: Intuitively typed params, used to return data types as defined in the models (e.g: json instead of (string | number)[] ). Conversion will occur in the service. Each controller has the typings in a separate definitions file (``MANDATORY``)

## Services
Perform the business logic related operations along with all the sql. The service is the ONLY connection to the db, through the `BaseService`. Each model has its own service attached to it. 
- **Typing**: For operations directly related to getter/setter, a service receives types as defined by the models (adding user ips for instance), and returns types as defines by the `DTOs`. The sole exception to this right now is the `auth service`. Furthermore, in case of creating a record from the front, we will be receiving DTO in the service to transform it into D...Recordsince the end goal is for the information to be used in the front. Each service has its own type definitons file ``IF NECESSARY`` (DTOs should drive the flow of data as soon as a record is plucked out).
- Auth service: will eventually handle authentication and access control for both project management, admin and family tree workspaces. No record attached to it, hence the slightly different typing

## Routes
Gateway to the services, provide the API endpoints for the front to call any of the available services.
- **Typing**: DTOS only

## TODOS:
Make it a habit to global search TODOs (or add it to the precommit scripts). There will be several of them in the initial phases.

# `POTENTIAL CHANGES:`
    - Separation: standalone app for each space
#

# `COMMANDS`
#
 `Good source:` [here](https://gist.github.com/bgoonz/cd6312bfeae2d3f07655cb84e30413e9)
#
## DB
- New: 
    ```
    npx sequelize-cli db:create
    ```

- Drop: 


## Models
- New: 
    
    ```
    ... model:create --name SampleModel --attributes sampleAttr:string,secondAtt:json
    ```
- Update: create new migration and perform update in migration file (make sure to use add/removeColumn in the up/down methods)
    
## Migrations
- Create one:
```
npx sequelize-cli migration:create --name descriptiveName
```
- Migrate: 
    ```
    npx sequelize-cli db:migrate
    ```

- Rollback:
    ```
    npx sequelize-cli db:migrate:undo
    ```

- Rollback all:
    ```
    npx sequelize-cli db:migrate:undo:all
    ```

## Seeds

- Generate:
    ```
    npx sequelize-cli seed:generate --name <descriptiveName>
    ```

- Run all:
    ```
    npx sequelize-cli db:seed:all
    ```

- Rollback latest: 
    ```
    npx sequelize-cli db:seed:undo
    ```

- Rollback all:
    ```
    npx sequelize-cli db:seed:undo:all
    ```

## Playground
- Run ts file: 
```

```
# STRUCTURE
## Naming conventions (WIP)
- Types: `DTypeName`
- Functions arguments: `p_arg`
- Generics: `GTypeName`
- Sql statement variables: `const select/insert/update/delete`

## Models
Define the attributes for each entity, as well as the related table
- **Typing**: see sequelize docs

## Controllers
Define the basic getters/setters for each entity, and provide those capabilities to the related service.
- **Typing**: Intuitively typed params, used to return data types as defined in the models (e.g: json instead of (string | number)[] ). Conversion will occur in the service. Each controller has the typings in a separate definitions file (``MANDATORY``)

## Services
Perform the business logic related operations. Each model has its own service attached to it. 
- **Typing**: For operations directly related to getter/setter, a service receives types as defined by the models (registering user for instance), and returns types as defines by the `DTOs`, since the end goal is for the information to be used in the front. Each service has its own type definitons file ``IF NECESSARY`` (DTOs should drive the flow of data as soon as a record is plucked out).

## Routes
Gateway to the services, provide the API endpoints for the front to call any of the available services.
- **Typing**: DTOS only

## TODOS:
Make it a habit to global search TODOs (or add it to the precommit scripts). There will be several of them in the initial phases.

## POTENTIAL CHANGES:

#

# COMMANDS
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
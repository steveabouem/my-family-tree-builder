# `PROJECT STRUCTURE`
 
## Family tree: `APP #1`
All routes and entities are prefixed by `FT`. They are seggragated from the others for now.

### Workflow (tree generation)
#### Option 1: standalone to greater tree (Fam != Tree)
`Entities:`
    *Tree*:
    (id, ASSOC families (JSON), public)
    *Family*:
    (...details, ASSOC members(JSON), )
    *FT User (member)*:
    (...details, FK parent_1/2, FK imm_fam)
`FLow:`
    User->create() => 
        Family->create() (See FKs above)
            FTTree->SELECT()  ONLY ONE PER USER (allow dd search to find by last parent_1/2, better than last name cuz of id.).
                e.g.: I create my fam, defaults to its own standalone tree, gives me the option to lookup greater tree as mentionned above. 
    *QUESTION*: How in the fUCK do I differentiate standalone tree from greater one? *How are they not the same*?!?!?!
`Query:`
    members->where id of parent_1/2 , current user will be in there.relations need to be here, (siblings (JSON))
    
#### Option 2: Fam === Tree
`Entities:`
    *Family*(family_tree):
    (...details, ASSOC members(JSON), )
    *FT User (member)*:
    (...details, FK parent_1/2, *FK imm_fam is obsolete*, FK family_Tree )
`FLow:`
    User must be prompted on their relations (parents are mandatory, bros and sis = prompt and hide fields if none.)
    *NEW Tree*: I create, add my parents, Jo as spouse, bros and sis, along w my kids (tree1). 
    Jo creates, adds me as spouse, parents and sis's (tree 2).
    *Existing Tree*:I created and added parents already + JP. Jp needs to tell me if his family already exists, so *prompt for parent_1/2 name ot start*.
    *QUESTION*: how many members can edit/create tree? admin? free for all? *let's try multiple, provided they're part of initial tree (ep: Jp in my case)*

more details: family_tree has an infinite amount of members. Each family_member identifies its siblings (JSON array), mother and father, as well as spouse (FK user id). 

So for instance, in order to find all family_members from my tree, the query would look something like this:
```
SELECT * from family_members where tree_id = 1;
```

A query to get all the members from a same "line" i.e. same generation, i.e same parent level as ne would look like this:
```
SELECT * from family_tree t JOIN family_member m ON m.tree_id = t.id WHERE m.parent_2 = [father's user id] and m.parent_1 = [mother's user id];
```
`Query:`
    members->where id of parent_1/2 , current user will be in there.relations need to be here, (siblings (JSON))

## Tracker Management: `APP #2`
For the time being, given that the family tree requirement came along as the project was already under way.

# `CODING STRUCTURE`

## Naming conventions (WIP)
- Types: `DTypeName`
- Generics: `GTypeName`
- Sql statement variables: `const select/insert/update/delete`
- Queries: prioritize Sequelize, outside of Base classes (this is mainly because of automaticly generated associations get - set functions). `result` for single record, `results` for arrays
- Variables for models in controller/middlewares: const current... = fetchDataOnCurrentlyDisplayedModel, const target... = fetchAnotherRecord
- Booleans/validations: const `variableValid` = ...;
- Snake vs Camel: db fields and DTOS (for mapping in queries): snake, functions args: camel,  `everything else: camel`
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
Define the basic getters/setters for each entity, and provide those capabilities to the related middleware. I.E: the middleware receives the params and performs the queries, and if necessary the business logic. `NO QUERIES IN CONTROLLER` -->

- **Typing**: Intuitively typed params, used to return data types as defined in the models (e.g: json instead of (string | number)[] ). Conversion will occur in the middleware. Each controller has the typings in a separate definitions file (``MANDATORY``)

## Middlewares
Only deal with required pre requests operation (exp IP verification), *DO NOT use as a helper class*. Create a helper if necessary

## Controllers
Perform the business logic related operations along with all the sql. This is the ONLY connection to the db, through the `BaseController`.
- **Typing**: For operations directly related to getter/setter, a controller receives types as defined by the models (adding user ips for instance), and returns types as defines by the `DTOs`. The sole exception to this right now is the `auth controller`. Furthermore, in case of creating a record from the front, we will be receiving DTO in the controller to transform it into D...Recordsince the end goal is for the information to be used in the front. Each controller has its own type definitons file ``IF NECESSARY`` (DTOs should drive the flow of data as soon as a record is plucked out).
- Auth controller: will eventually handle authentication and access control for both project management, admin and family tree workspaces. No record attached to it, hence the slightly different typing

## Routes
Gateway to the controllers, provide the API endpoints for the front to call any of the available controllers. Apply any relevant middleware before any other request.
- **Typing**: DTOS only

## Logs and Error handling
Expressjs has a [recommended way to handle errors](https://expressjs.com/en/guide/error-handling.html#error-handling). Thats what I will follow.
Logging will be done with winston
ALL endpoints will use *try/catch*, validate and throw error if necessary, to log it appropirately. *!No function should ever return null. Either return the intended value, or void!*.
Logging will be in the format of `logger[error | info | warning]('[error | info | warning]', '! Controller.method !', e);` in the catch block

## TODOS:
Make it a habit to global search TODOs (or add it to the precommit scripts). There will be several of them in the initial phases.

# `POTENTIAL CHANGES:`

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
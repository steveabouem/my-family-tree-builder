# Common commands

#### Run migration
`php bin/console make:migration` then `php bin/console doctrine:migrations:migrate`

#### Debug routes
`php bin/console debug:router`

#### Clear all cache (for migrations for instance)
`php bin/console cache:pool:clear cache.global_clearer`

#### Reset migration
- Clear cache: `php bin/console cache:clear --env=prod`
- Delete all migration files
- Dump schema: `php bin/console doctrine:migrations:dump-schema`
- Rollup migration: `php bin/console doctrine:migrations:rollup`
- Make migration

# Know issues and fixes

#### XAMPP
- `Error: MySQL shutdown unexpectedly`: 
    make sure you ran XAMPP as an admin
    Rename the `data` XAMPP sub folder to something else, than the `backup` sub folder to data.
    Alternatively, change ports

#### ORM/DOCTRINE  
- `Foreign key constraint incorrectly formed`:
    Make sure to define relations one at the time for easy debug
    Last resort, delete migration files and start over, one relation at the time
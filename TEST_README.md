# Handling the Testing database

- [ ] Determine a more elegant solution for tearing down the entire database

When we want to scrap the migrations, we need to destroy the `./db/` folder so we can regen migrations.
Doing this will break the testing database due to existing migrations

## Options:
1. Destroy both containers in docker and rebuild them
2. a script and be used to drop tables if they exist


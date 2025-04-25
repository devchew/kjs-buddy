# KJS-Buddy Backend API Documentation

1. maintain the copy of on device saved cards for registered users to sunc them acros devices
1. crud for predefined cards

## auth

simple login/register module, based on google/fb quick login,
and email/password login

roles should be supported
- admin
- user

## cards
> only for authenticated users
> all cards are stored in the database, and can be accessed from any device
> only card owner can access their cards

### `[GET] /cards`
get all cards assigned to the user

### `[GET] /cards/{id}`
get card by id

### `[POST] /cards`
create new card

### `[PUT] /cards/{id}`
update card by id

### `[DELETE] /cards/{id}`
delete card by id

## cards/templates

### `[POST] /cards/templates/create`
> only for authenticated users
create new card template

### `[GET] /cards/templates`
> access without authentication
get all card templates flaged as public

### `[GET] /cards/templates/{id}`
> access without authentication
get card template by id

### `[PUT] /cards/templates/{id}`
> only for authenticated users
> access only for the owner of the template
update card template by id

### `[DELETE] /cards/templates/{id}`
> only for authenticated users
> access only for the owner of the template
delete card template by id


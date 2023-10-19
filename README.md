# Gympass style api

## Functional requirements

- [x] Register a new user
- [x] Authenticate a user
- [x] Get user profile
- [x] Get check-ins from a logged user
- [x] History of check-ins from a logged user
- [ ] Get nearby gyms from a logged user
- [x] User find gyms by name
- [x] User check-in in a gym
- [ ] Validate user check-in
- [x] Register a gym

## Bussiness rules

- [x] user should not be able to register with a duplicated email
- [x] user should not do 2 check-ins in the same gym in the same day
- [x] user should not do check-in in a gym that is 100m away from him
- [ ] check-in could be validated until 20min after the check-in has been created
- [ ] check-in could be validated only by the admin user
- [ ] Gym should be registered from a admin user

## Non-functional requirements

- [x] user password should be encrypted
- [x] api data should be persisted with a Postgres database
- [x] all data list should be paginated with 20 items per page
- [ ] User should be identified by a JWT token

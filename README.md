# App

Gympass style api

## Functional requirements

- [ ] Register a new user
- [ ] Authenticate a user
- [ ] Get user profile
- [ ] Get check-ins from a logged user
- [ ] History of check-ins from a logged user
- [ ] Get nearby gyms from a logged user
- [ ] User find gyms by name
- [ ] User check-in in a gym
- [ ] Validate user check-in
- [ ] Register a gym

## Bussiness rules

- [ ] user should not be able to register with a duplicated email
- [ ] user should not do 2 check-ins in the same gym in the same day
- [ ] user should not do check-in in a gym that is 100m away from him
- [ ] check-in could be validated until 20min after the check-in has been created
- [ ] check-in could be validated only by the admin user
- [ ] Gym should be registered from a admin user

## Non-functional requirements

- [ ] user password should be encrypted
- [ ] api data should be persisted with a Postgres database
- [ ] all data list should be paginated with 20 items per page
- [ ] User should be identified by a JWT token

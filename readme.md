
## Triggers
 - [x] Account balance trigger
 - [x] New transaction trigger

## Actions
 - [x] Add Transaction
 - [ ] Update transaction

## TODO:

- [] Implement a 'preferred budget' setting (needs a DB for user preference)
- [] Consider a stored balance log to replace on-the-fly logs (which can change retroactively). Needs to be somewhat intelligent, so as to not trigger every time a matching item is added to the log, like "trigger once, then wait until it no longer matches those criteria"

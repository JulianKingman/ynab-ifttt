## What is it?

This is a Node.js shim server that stands in between YNAB and IFTTT, allowing easy addition of triggers and actions. I created a couple triggers and actions for proof of concept, and the infrastructure is built out such that any additions (a few suggested below) will be super easy, compared to the task so far :)

In order to go live as a public service, the tests need to be fleshed out, as I frankly ignored most of that part of the IFTTT documentation.

### Note on reliability

I have seen this fail a couple times due to timeouts. Some queries to YNAB take upwards of 6s, possibly longer; I'm not sure that IFTTT waits that long. Also Heroku goes to sleep when not in use, so for best performance, wake it up before using it.

## Helpful links

Video demo: https://www.youtube.com/watch?v=x3Z9DQ2_tno

Currently hosted service: https://platform.ifttt.com/services/ynab_contest/
Docs: https://platform.ifttt.com/docs
IFTTT NPM Library: https://github.com/amadeusmuc/node-ifttt
Heroku instance: https://morning-castle-62240.herokuapp.com (https://morning-castle-62240.herokuapp.com/ifttt/v1)


## Triggers

- [x] Account balance
- [x] New transaction
- [ ] Amount of budget used
- [ ] Age of Money
- [ ] Repeating transaction

## Actions

- [x] Add Transaction
- [x] Update transaction

## TODO:

- [] Set up the test endpoints properly
- [] Test the endpoints thoroughly
- [] Implement a 'preferred budget' setting (needs a DB for user preference)
- [] Consider a stored balance log to replace on-the-fly logs (which can change retroactively). Needs to be somewhat intelligent, so as to not trigger every time a matching item is added to the log, like "trigger once, then wait until it no longer matches those criteria"

React Authentication Starter
=====

> Uses react, node and jwt to send a receive a user registration request

#### Getting started
```
$ git clone <this_repo>
$ npm install
$ nodemon server 
```

### Deployment

```sh
heroku create <app_name>
heroku config:set NODE_ENV=production
heroku addons:create mongolab:sandbox 
heroku config | grep MONGOLAB_URI
git push heroku master
heroku ps:scale web=1
```

### Contributing

Contributions welcome.

- Need to handle response for persistent user login (perhaps need flux or some extra custom js)
- Also can package everything up with webpack/browserify for commonjs syntax

# attendee-web

### Setup:

```npm install```

### Run the organizer app on local server:
```npm run organizer-dev```
It will deploy to localhost:8080

### Run the attendee app on local server:
```npm run attendee-dev```
It will deploy to localhost:8081

### Build prod code:
```npm run build-prod```

### Build staging code:
```npm run build-stage```


#### [localhost:8080](http://localhost:8080)
#### [localhost:8081](http://localhost:8081)


### Linter
to run the linter locally: ```node_modules/.bin/eslint```

to run the linter globally (like in a text editor) you have to install all eslint plugins globally:
 ```npm install -g eslint```
 ```npm install -g eslint-config-airbnb```
 ```npm install -g eslint-plugin-import```
 ```npm install -g eslint-plugin-jsx-a11y```
 ```npm install -g eslint-plugin-react```

then run ```elint```

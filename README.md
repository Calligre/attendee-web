# attendee-web

## Development

Install dependencies with

    npm install

Then, to run the organizer app on [localhost:8080](http://localhost:8080):

    npm run organizer-dev

To run the attendee app on [localhost:8081](http://localhost:8081):

    npm run attendee-dev

## Deployment

Install dependencies with

    npm install --only=production

Then, to build the production bundle:

    npm run build

## Linter

To run the linter locally, run `node_modules/.bin/eslint`

To run the linter globally (like in a text editor) you have to install all eslint plugins globally:

    npm install -g eslint
    npm install -g eslint-config-airbnb
    npm install -g eslint-plugin-import
    npm install -g eslint-plugin-jsx-a11y
    npm install -g eslint-plugin-react

then run `eslint`.

# Project: Demo

# Features

* ExpressJS
* Database ORM (PostgresQL)
* Manage multiple env config with [node-config](https://github.com/lorenwest/node-config)
* Log API requests with [morgan](https://github.com/expressjs/morgan)

## Code Style
* [editorconfig](https://editorconfig.org/) is used to help maintain consistent coding styles for multiple developers
    * It should be easy for most IDE to setup editorconfig support
* [husky](https://github.com/typicode/husky) is used to support hook action
    * pre-commit: [lint-staged](https://github.com/okonet/lint-staged) to perform action only for staged files
        * run prettier
        * run eslint check & fix error if possible
        * run git add
    * pre-push: run test with mocha

# Installation
* clone git repo 
* run npm install
* your IDE should install plugins to check code style & format code
    * For VS Code below plugin could be used
        * [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
        * [Editorconfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
* app can be debug using [VSCode](https://code.visualstudio.com/docs/nodejs/nodejs-debugging?wt.mc_id=medium-blog-jopapa)

#Run Local
* npm run start (node app.js)

# Requirements
* Node 12.13.1


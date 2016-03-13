# Open Foundry
### Prerequisites
- [Node](https://nodejs.org/ "Node") v.4.1.1 installed  (to manage node versions use [NVM](https://github.com/creationix/nvm) )
- If using nvm, run command `nvm use`
- [NPM](https://www.npmjs.com/ "NPM Package Manager") installed
- [MongoDB](https://www.mongodb.org/) installed

### Setup
- Clone this repository
- Cd to root repository directory in Terminal
- Run the following commands:
- `npm install`
- `gulp export` generates the css and images
- `gulp copy` copies over generated css and images
- `gulp` starts it up
- Files are copied to `dist` folder
- Point browser to `localhost:7777`
- TIP: on OSX create ~/datadb/ in case of database connection issues

### Bumping version
Do this before pushing a new release.
This will increment the version value within package.json and create a Git tag. In addition to keep track of the releases this will create a cache-burst to keep interdependent assets such as JS and CSS files up to date.
- `gulp bump --minor` or simply `gulp bump` =>  Minor release(e.g. new features, 0.2.0)
- `gulp bump --patch` => Patch (e.g. quick fixes, 0.0.2)
- `gulp bump --major` => Major (e.g. new site version, 2.0.0)



### Notes
- Breakpoint mixin is `mobile`
- eg. `@include mobile { /* add styles */ }`

# QuestionnaireExercise
## Tech Stack
Node.js and React
SQLite DB
Deployed to LiteSpeed Server @ tsdm.software/bioverse

### Dependencies
use 
```
npm install 
```
inside client/ and server/ to get the requirements from the package.json

Note: A .env file is not included in this project as it was designed as a one-off exercise. If you are running this in a production environment, you may need to create your own .env file to configure necessary environment variables such as database URLs or API keys.

### How to Run Local

1. To create database you can run data/createDB.js.
```
node createDB.js
```

2.
You can run server with
```
node index.js
```

3. Run the client by

```
npm start
```

4. To deploy to a production environment you made need to set environmental variables and change the endpoints if you are using a subdomain.
In the client folder make a build by running the command

```
npm run build
//on linux, or just copy in file directory
cp -r client/build server/build
//now run the server with 
node index.js
```

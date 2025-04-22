# QuestionnaireExercise
## Tech Stack
Node.js and React
SQLite DB
Deployed to LiteSpeed Server @ tsdm.software/bioverse


## Description
This is a demo questionnaire app to demonstrate my ability in full-stack development. The API is live at tsdm.software/bioverse

User Interface (Front-End):
### Login Page:
● Function: Allows users to enter a username and password and navigate the user to the
correct page accordingly.
● Requirements: Once logged in as a user, navigate the user to the questionnaire
selection page. Once logged in as an admin, navigate the user to the admin panel page.
● Required Fields: Username, Password
Questionnaire Selection Page
● Function: Allow users to select which questionnaire they would like to complete
● Requirements: Navigate the user the respective questionnaire when clicked on.
### Questionnaire Page:
● Function: Displays questions to users’ and stores the user’s input data into the
database.
● Requirements:
o Each question is rendered logically such that the user is able to interact and
provide an answer which will be reviewed by an administrator later.
▪ Upon completion of an intake, navigate the user back to the
questionnaire selection page.
o Has input validation
o Questions with *Select all that apply* must record all answers that the user
selects.

### Admin Panel:
● Function: Enables administrators to view a different users’ answers organized
● Features: A table of usernames and how many questionnaires they have completed.
Administrators can click into the row and a modal opens displaying all the answered
questionnaires for the user.
● For displaying questions, shows the username, questionnaire name, then followed by the
questions/answers in a “Q: ... A: ...” format.


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

Note the only feature I believe is not implemented is autopopulating the fields.

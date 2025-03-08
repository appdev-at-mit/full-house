# Full House
Full House is a web application to help students find roommates and housing for the summer and post-graduation. Students can create a profile with information about their location, when they are looking for a roommate, and their roommate preferences. Users can search for and message other users to coordinate housing plans.

Additionally, users can create accomodation listins on Full House. For instance, if a user has an apartment that they would like to share with another person, they can create a listing with the accomodation details.

## Getting started
If you do not have git, install here: https://git-scm.com/downloads

Create a folder where you would like to store the Full House source code. Run the following commands in git bash:
```cd {foldername}```
```git init```
```git remote add origin https://github.com/full-stack-at-mit/full-house.git```
```git pull origin main```
The folder should now contain the source code. Run the following commands to run the frontend:
```cd fullhouse-frontend```
```npm install```
```npm run dev```
The frontend should be hosted on localhost port 3000.

Run the following commands to run the backend:
```cd ..```
```cd fullhouse-backend```
```pip install -r requirements.txt```
```py manage.py runserver```
The backend should be running.

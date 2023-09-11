# Codewars
Project and application where you can find partial copy of CodeWars. Application was developed as course project at college.
## Functional
There was implemented main functional of CodeWars. It's running the code in the browser. 
It is possible to execute code in languages ​​such as C#, JAVA, TypeScript, JavaScript.
Each individual language is implemented as a docker container on the server side
## Screenshots
![image](https://github.com/sluzerpp/CodeWars/assets/75631223/52c82050-47f9-4eab-9f50-ef3e8f0abf1c)
![image](https://github.com/sluzerpp/CodeWars/assets/75631223/6794854a-ea75-4b14-8d1c-62a01408fca8)
## Tech stack
### Client
- React
- Axios
- Mantine
- Typescript
- SASS
- CodeMirror for editors
- Redux
### Server
- Node.js
- Express
- Sequelize for database manipulation
- SQLite3
- Dockerode for docker manipulation
## How run locally 

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Docker](https://www.docker.com) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/sluzerpp/CodeWars

# Go into the repository to client folder and install dependencies
$ npm install

# Do also into server folder

```

Then start Docker and install images from [archive](https://drive.google.com/file/d/1p0RwC9Xf5BnBQG4E3hsYGfOMHPcaAn5l/view?usp=drive_link).
1. Unzip archive
2. Open the console
3. Write this command for each image `docker load < path/to/container-name.tar`
Start client and server app

```bash
# Go into client folder and start the app
npm run dev

#Go into server folder and start the app
npm run dev
```
## More Screenshots
![image](https://github.com/sluzerpp/CodeWars/assets/75631223/5d0891a9-7e71-439a-96f4-a87b4024093f)
![image](https://github.com/sluzerpp/CodeWars/assets/75631223/45f135ec-4340-47dc-9d59-7d193c4de4ae)
![image](https://github.com/sluzerpp/CodeWars/assets/75631223/a7dc884b-1f88-4658-bb8e-69f7a57cef8b)




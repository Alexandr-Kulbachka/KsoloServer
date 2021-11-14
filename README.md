Prepare your environment to run the server:

npm install -D typescript@3.3.3

npm install -D tslint@5.12.1

npm install -S express@4.16.4

npm install -D @types/express@4.16.1

npm install -g typescript 

------------------------------------------------

Installing the required libraries:

npm install https ws

------------------------------------------------

Server administration:

    run server:
npm start

    kill server process on the port:
netstat -ano | findstr :3000

tskill typeyourPIDhere 

------------------------------------------------

Upload updates to Heroku (automatically runs on the host):

git push https://git.heroku.com/ksolo-server.git dev:master

    or

npm run deploy

Connect to the server logs:

heroku logs --tail

------------------------------------------------





require('dotenv').config();
import express from 'express';
import DbMediator from './mediators/db_mediator/db_mediator';
import * as https from 'https';
import * as WebSocket from 'ws';
import RequestMessage from './models/message_models/message_models/request_message_model';
import ResponceMessage from './models/message_models/message_models/responce_message_model';
import callApi from './api/api_list';
import LogService from './services/log_service/log_service';
// import AccountService from './services/account_service/account_service';

const app = express();

let port: number = Number(process.env.PORT) || 3000;
const server = app.listen(port, function() {
    LogService.printLog(`Ready on port ${port}`);
});

const anonymousRequests = [
    '/create_account'
];

DbMediator.initConnection().then(
    result => {
        app.get('/', (request, response) => {
            response.send('OK');
        });

        // app.get('/create_account', async (request, response) => {
        //     let result: ResponceMessage;

        //     LogService.printLog(JSON.stringify(request.query));

        //     result = await AccountService.createAccount(
        //         String(request.query['email']),
        //         String(request.query['password']),
        //         String(request.query['first_name']),
        //         String(request.query['last_name']),
        //         String(request.query['patronymic']),
        //         String(request.query['birth_date']),
        //         String(request.query['specialty']),
        //     );
        //     response.send(result.getResponceText());
        // });

        server.on('error', function (err) {
            if (err) {
                LogService.printLog(JSON.stringify(err));
            }
        });

        let WebSocketServer = WebSocket.Server;
        let wsServer = new WebSocketServer({
            server: server,
            verifyClient: async function (info, callback)  {
                var authorizationToken:string = info.req.headers['token'] + "";
                var canBeAuthorized:boolean = true;
                var checkTokenResult:ResponceMessage;

                // if(authorizationToken){
                //     checkTokenResult = await AccountService.checkToken(authorizationToken);
                //     canBeAuthorized = checkTokenResult.parameters['is_valid'];
                // }

                if (!canBeAuthorized){
                    callback(false, 401, checkTokenResult.errors[0]);
                    LogService.printLog('Incoming connection rejected. Reason: ' + checkTokenResult.errors[0]);
                }
                else {
                    LogService.printLog('Incoming connection allowed.');
                    callback(true);
                }
             }
        });

        wsServer.on('connection', ws => {
            ws.onmessage = async message => {
                try {
                    if (message != null) {
                        let incomingMessage: RequestMessage = new RequestMessage(message.data.toString());
                        LogService.printLog(`Incoming request: ${JSON.stringify(incomingMessage)}`);

                        if (incomingMessage.name == null) {
                            LogService.printLog(`Error: Request must contain name of the method`);
                            ws.send(JSON.stringify(new ResponceMessage("Error", new Map(), ["Request must contain name of the method"])));
                        } else {
                            let responce: ResponceMessage;
                            responce = await callApi(incomingMessage.name, incomingMessage.parameters);

                            LogService.printLog(`Server responce: ${responce.getResponceText()}`);

                            ws.send(responce.getResponceText());
                        }
                    }
                } catch (e) {
                    LogService.printLog(e.message);
                }
            };

            ws.onerror = err => {
                LogService.printLog(err.message);
            }
        });

    },
    error => { LogService.printLog(error) }
);
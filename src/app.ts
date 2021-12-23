require('dotenv').config();
import express from 'express';
import DbMediator from './mediators/db_mediator/db_mediator';
import * as http from 'http';
import * as WebSocket from 'ws';
import RequestMessage from './models/message_models/request_message_model';
import ResponceMessage from './models/message_models/responce_message_model';
import callApi from './api/api_list';
import LogService from './services/log_service/log_service';
import { isStringNotEmpty } from './different_functions/different_functions';
// import AccountService from './services/account_service/account_service';

const app = express();

let port: number = Number(process.env.PORT) || 3000;

const server = http.createServer(app).listen(port);

const anonymousRequests = [
    'create_account'
];

var clients: { [id: string]: WebSocket; } = {};

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
            clientTracking: true,
            verifyClient: async function (info, callback)  {
                var authorizationToken:string = info.req.headers && info.req.headers['token'] ? String(info.req.headers['token']) : null;
                var uid:string = info.req.headers && info.req.headers['account_uid'] ? String(info.req.headers['account_uid']) : null;
                var requestName:string = info.req.headers && info.req.headers['request_name'] ? String(info.req.headers['request_name']) : null;
                var canBeAuthorized:boolean = true;
                var anonymousRequest:boolean = false;
                var checkTokenIndUidResult:ResponceMessage;

                if (authorizationToken && uid){
                    // checkTokenIndUidResult = await AccountService.checkTokenAndUid(authorizationToken);
                    // canBeAuthorized = checkTokenIndUidResult.parameters['is_valid'];
                } else if (anonymousRequests.includes(requestName)) {
                    anonymousRequest = true;
                }

                if (!canBeAuthorized && !anonymousRequest){
                    callback(false, 401, checkTokenIndUidResult.errors[0]);
                    LogService.printLog('Incoming connection rejected. Reason: ' + checkTokenIndUidResult.errors[0]);
                }
                else {
                    LogService.printLog('Incoming connection allowed.');
                    callback(true);
                }
             }
        });

        wsServer.on('connection', function connection(ws, req, client) {
            var requestName:string = req.headers && req.headers['name'] ? String(req.headers['name']) : null;
            if (anonymousRequests.includes(requestName)) {
                var clientId:string = String(req.headers['account_uid']);
                clients[clientId] = ws;
            }

            ws.onmessage = async message => {
                try {
                    if (message != null) {
                        let incomingMessage: RequestMessage = new RequestMessage(message.data.toString());
                        LogService.printLog(`Incoming request: ${JSON.stringify(incomingMessage)}`);

                        if (incomingMessage.name == null) {
                            LogService.printLog(`Error: Request must contain name of the method`);
                            ws.send(JSON.stringify(new ResponceMessage("Error", new Map(), ["Request must contain name of the method"])));
                        } else {
                            if (incomingMessage.parameters['account_uid'] in clients || anonymousRequests.includes(incomingMessage.name)) {
                                let responce: ResponceMessage;
                                responce = await callApi(incomingMessage.name, incomingMessage.parameters);
                                LogService.printLog(`Server responce: ${responce.getResponceText()}`);
                                ws.send(responce.getResponceText());
                            } else {
                                ws.close();
                            }
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
        LogService.printLog(`Ready on port ${port}`);
    },
    error => { LogService.printLog(error) }
);
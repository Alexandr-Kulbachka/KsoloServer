 import ResponceMessage from '../models/message_models/message_models/responce_message_model';
// import AccountService from '../services/account_service/account_service';
// import EventService from '../services/event_service/event_service';
// import ParticipantsService from '../services/event_service/participants_service';
// import PostsService from '../services/event_service/posts_service';
// import SpeakersService from '../services/event_service/speakers_service';

var apiList: { [elementType: string]: (parameters: Map<string, any>) => Promise<ResponceMessage>; } = {

};

async function callApi(apiName: string, parameters: Map<string, any>): Promise<ResponceMessage> {
    console.log(apiList[apiName]);
    return await apiList[apiName](parameters);
}

export default callApi

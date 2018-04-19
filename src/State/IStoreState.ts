import Event from '../Helpers/Event';
import User from '../Helpers/User';

export default interface IStoreState {
    GoogleReducer: {
        fetching: boolean;
        userData?: { id: User };
        eventData?: { id: Event };
        googleSheetDataError?: object;
        isSignedIn?: boolean;
    }
    WebsiteReducer: {
        mainPerson?: User;
        infoPerson?: User;
    }
}
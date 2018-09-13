import { IConnections, IUser } from "../Types/Users";

export default class User implements IUser {
    constructor(
        public id: string,
        public name: string,
        public gender: string,
        public age: number,
        public location: string,
        public contact: string,
        public redList?: string[],
        public greenList?: string[],
        public connections?: IConnections) {
    }

    public firstNameAndLastInitial = (name: string) => {
        const tempSeparate = name.split(" ");
        if (tempSeparate.length > 1) {
            return tempSeparate[0] + " " + tempSeparate[1][0];
        }
        return tempSeparate[0];
    }
}
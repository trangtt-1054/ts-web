//như kiểu query, fetch toàn bộ user trước để biết là đã có user nào trong db từ đó mới fetch detail, vì nhỡ xảy ra trường hợp fetch 1 cái id mà ko biết id đó đã có trong db hay chưa

import axios, { AxiosResponse } from "axios";
import { User, UserProps } from "./User";
import { Eventing } from "./Eventing";

export class Collection {
  models: User[] = [];
  events: Eventing = new Eventing();

  constructor(public rootUrl: string) {}

  get on() {
    return this.events.on; //ko đc dùng shortcut on = ... khi initialize Eventing inline như trên kia
  }

  get trigger() {
    return this.events.trigger;
  }

  fetch(): void {
    //take the value from res, take each of the object and turn into an instance of User and add to the models array
    axios.get(this.rootUrl).then((res: AxiosResponse) => {
      res.data.forEach((value: UserProps) => {
        const user = User.buildUser(value);
        this.models.push(user);
      });
      this.trigger("change");
    });
  }
}

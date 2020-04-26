//như kiểu query, fetch toàn bộ user trước để biết là đã có user nào trong db từ đó mới fetch detail, vì nhỡ xảy ra trường hợp fetch 1 cái id mà ko biết id đó đã có trong db hay chưa

import axios, { AxiosResponse } from "axios";
import { Eventing } from "./Eventing";

//T, K là 2 generics Type, T for User, K for UserProps
export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();

  constructor(
    public rootUrl: string,
    public deserialize: (json: K) => T //takes in some json data and turns into instance of actual object
  ) {}

  get on() {
    return this.events.on; //ko đc dùng shortcut on = ... khi initialize Eventing inline như trên kia
  }

  get trigger() {
    return this.events.trigger;
  }

  fetch(): void {
    //take the value from res, take each of the object and turn into an instance of User and add to the models array
    axios.get(this.rootUrl).then((res: AxiosResponse) => {
      res.data.forEach((value: K) => {
        //const user = User.buildUser(value); //chỗ này là object User => cho constructor nhận thêm some JSON data and returns an instance of Model => thêm deserialize
        this.models.push(this.deserialize(value));
      });
      this.trigger("change");
    });
  }
}

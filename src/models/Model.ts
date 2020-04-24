import { AxiosPromise, AxiosResponse } from "axios";

interface ModelAttributes<T> {
  set(value: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise; //thực ra trả về promise thì ko prefer lắm, có thể dùng local storage thay thế, nhưng mà tạm thời cứ để thế
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

interface HasId {
  id?: number;
}

export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  /*  vì Attributes cần argument mà argument đó lại pass vào từ constructor của user nên cần set up kiểu này. Khi mà ko cần argument từ constructor của User (như Eventing) thì có thể initialize trên cùng 1 dòng OK

  on(eventName: string, callback: Callback): void {
    this.events.on(eventName, callback); //NG vì nếu có update gì ở class Eventing thì sẽ phải quay lại tất cả các class đang dùng Eventing để update theo => nên dùng getter
  } 

  get on() {
    return this.events.on; //not calling on() here, just a reference to the events.on method, như thế có thể invoke lúc nào tuỳ mình muốn
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  } 
 */
  //shortcut of get on()...
  on = this.events.on;
  trigger = this.events.trigger;
  get = this.attributes.get;

  set(update: T): void {
    this.attributes.set(update);
    this.events.trigger("change"); //notify the rest of the application that something has changed
  }

  fetch(): void {
    const id = this.attributes.get("id");
    if (typeof id !== "number") {
      throw Error("Cannot fetch without an id");
    }

    this.sync.fetch(id).then((res: AxiosResponse): void => {
      this.set(res.data); //ko pass qua this.set mà pass gọi trực tiếp set() của attributes vì ko muốn trigger event nào trường hợp này cả.
    });
  }

  save(): void {
    this.sync
      .save(this.attributes.getAll())
      .then((res: AxiosResponse): void => {
        this.trigger("save");
      })
      .catch(() => {
        this.trigger("err");
      });
  }
}

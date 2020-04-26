export class Attributes<T> {
  constructor(private data: T) {}

  get = <K extends keyof T>(key: K): T[K] => {
    //return string or number
    return this.data[key];
  };

  set(update: T): void {
    Object.assign(this.data, update);
    //iterate over update object and take at property one by one or use Object.assign: take all the properties on update, copy paste them to this.data, overwrite properties of this.data
  }

  getAll(): T {
    return this.data;
  }
}

/* IN TS, Object Keys can be a TYPE 
mục tiêu là khi get(name) thì 100% trả về string, get(id) thì 100% trả về number chứ ko phải union type

generics ko chỉ dùng đc với class mà còn dùng đc với function => K extends keyof T, K chỉ có thể là 'name', 'age' hoặc 'id'
*/

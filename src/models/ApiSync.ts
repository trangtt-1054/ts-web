import axios, { AxiosPromise } from "axios";

interface HasId {
  id?: number;
}

export class ApiSync<T extends HasId> {
  constructor(public rootUrl: string) {}

  fetch(id: number): AxiosPromise {
    //when we call fetch, we want to pass in the id, trước đấy là ko có argument, giờ pass arg vào
    //vẫn gắn void mặc dù cái này return Promise
    return axios.get(`${this.rootUrl}/${id}`);
    // .then((res: AxiosResponse): void => {
    //   this.set(res.data);
    // });
  }
  /* set data is implemented in User, so we have to make response accessible to User => sửa thành: any time we call fetch, it will return a Promise that will actually RESOLVE WITH the data we get from API (the response). bây giờ fetch ở đây chỉ trả về Promise thôi, còn User tự đi mà set data. => bỏ toàn bộ đoạn .then đi, ko void nữa mà trả về AxiosPromise.

  So what we're gonna do with save()? when we call save(), we have no indication that the user has been successfully persisted to the BE => Cho save() trả về Promise luôn, so whenever save() is called we will get back some OBJECT we can use to determine whether or not the user was correctly persisted. => thêm return vào trước request
  */

  save(data: T): AxiosPromise {
    const { id } = data; //TS ko biết T là type gì nên sẽ ko chắc là có id trên type đó => use Generic constraints

    /* nếu có id, tức là user đã tồn tại trong db, thì sẽ update user đó, nếu chưa có id thì tạo user mới */

    if (id) {
      return axios.put(`${this.rootUrl}/${id}`, data);
    } else {
      return axios.post(this.rootUrl, data);
    }
  }
}

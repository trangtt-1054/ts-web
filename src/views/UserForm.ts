import { User, UserProps } from "../models/User";
import { View } from "../views/View";

export class UserForm extends View<User, UserProps> {
  //extends cái là dùng đc tất của bên View luôn, ví dụ this.model sẽ trỏ về View.model
  eventsMap(): { [key: string]: () => void } {
    return {
      //"click:button": this.onButtonClick,
      //"mouseover:h1": this.onHeaderHover,
      "click:.set-age": this.onSetAgeClick,
      "click:.set-name": this.onSetNameClick,
      "click:.save-model": this.onSaveClick,
    };
  }

  onButtonClick(): void {
    console.log("Hi there");
  }

  onHeaderHover(): void {
    console.log("H1 was hovered");
  }

  onSetAgeClick = (): void => {
    this.model.setRandomAge();
  };

  onSetNameClick = (): void => {
    //ở các framework thì chỗ này sẽ nhận event arg, ở đây cũng cho event vào đc nhưng mà event đó sẽ là event click, chứ ko phải là reference đến cái input => ko lấy đc text từ input => lấy trực tiếp từ DOM manually
    const input = this.parent.querySelector("input");

    if (input) {
      //đây là bước type guard make sure là có input thì mới chạy 2 cái kia. Vì sau khi bật strictNullCheck thì có warning là input có thể bị null nên phải type guard
      const name = input.value;
      this.model.set({ name });
    }
  };

  onSaveClick = (): void => {
    this.model.save();
  };

  template(): string {
    return `
    <div>
      <input placeholder="${this.model.get("name")}"/>
      <button class="set-name">Change name</button>
      <button class="set-age">Set random age</button>
      <button class="save-model">Save user</button>

    </div>
    `;
  }
  //gọi đc this.model.get('name') vì User extends Model
}

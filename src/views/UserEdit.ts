import { View } from "./View";
import { User, UserProps } from "../models/User";
import { UserForm } from "./UserForm";
import { UserShow } from "./UserShow";

export class UserEdit extends View<User, UserProps> {
  //1. define a regionsMap method that will overwrite the regionsMap of View class
  regionsMap(): { [key: string]: string } {
    return {
      userShow: ".user-show",
      userForm: ".user-form",
    };
  }

  onRender(): void {
    //do our nesting, UserShow extends View, mà View cần parent & model => UserShow cũng cần
    new UserShow(this.regions.userShow, this.model).render();
    new UserForm(this.regions.userForm, this.model).render();
  }

  template(): string {
    return `
      <div>
        <div class="user-show"></div>
        <div class="user-form"></div>
      </div>
    `;
  }
}

/* everytime we render UserEdit, we need to get a reference to the user-show div (create an instance of UserShow and pass in the div as UserShow's parent element) 

when we render UserEdit to the DOM, the render() method will call mapRegions(), mapRegions() will look at the regionsMap() THAT WE DEFINED INSIDE UserEdit, loop through the key-value and find the element that matches the selector, once it find the element, it will add to the regions property 
*/

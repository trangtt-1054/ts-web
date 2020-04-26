import { CollectionView } from "./CollectionView";
import { User, UserProps } from "../models/User";
import { UserShow } from "./UserShow";

export class UserList extends CollectionView<User, UserProps> {
  renderItem(model: User, itemParent: Element): void {
    //create a view, pass in model, render to itemParent
    new UserShow(itemParent, model).render();
  }
}
//last thing to do: build up a collection and pass to UserList

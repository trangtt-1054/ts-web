/* import { User } from "./models/User";

const user = User.buildUser({ id: 1 });

//set up event listener
user.on("change", () => {
  console.log(user);
});

user.fetch();
import { User } from "./models/User";

// const collection = new Collection<User, UserProps>(
//   "http://localhost:3000/users",
//   (json: UserProps) => User.buildUser(json)
// ); ko nên initialize collection ở đây

const collection = User.buildUserCollection();

collection.on("change", () => {
  console.log(collection);
});

collection.fetch(); */

/* import { UserEdit } from "./views/UserEdit";
import { User } from "./models/User";

//pass vào 1 cái element mà muốn render cái form ra cái element đấy
const user = User.buildUser({ name: "Jumong", age: 45 });

const root = document.getElementById("root");

if (root) {
  //type guard vì strictNullCheck on
  const userEdit = new UserEdit(root, user);
  userEdit.render(); //chạy lại parcel.html
  console.log(userEdit);
} else {
  throw new Error("Root element not found");
}
 */

import { UserList } from "./views/UserList";
import { UserEdit } from "./views/UserEdit";
import { Collection } from "./models/Collection";
import { UserProps, User } from "./models/User";

const users = new Collection(
  "http://localhost:3000/users",
  (json: UserProps) => {
    return User.buildUser(json);
  }
);

//fetch all the users from json server and trigger 'change' event (mỗi lần fetch mới là render lại)

users.on("change", () => {
  const root = document.getElementById("root");
  if (root) {
    new UserList(root, users).render();
  }
});

users.fetch();

const singleUser = User.buildUser({ id: 1 });

const sub = document.getElementById("sub");
if (sub) {
  new UserEdit(sub, singleUser).render();
}

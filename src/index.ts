// import { User } from "./models/User";

// const user = User.buildUser({ id: 1 });

// //set up event listener
// user.on("change", () => {
//   console.log(user);
// });

// user.fetch();
import { Collection } from "./models/Collection";

const collection = new Collection("http://localhost:3000/users");

collection.on("change", () => {
  console.log(collection);
});

collection.fetch();

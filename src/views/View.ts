import { Model } from "../models/Model";
// interface ModelForView {
//   on(eventName: string, callback: () => void): void
// }

/* ở đây đang dùng interface để làm Generics Constraint nhưng có thể dùng class Model để làm Generic Constraints luôn. Vì class cũng là 1 type, so that we can make sure type T is an instance of Model. Nếu dùng interface thì đằng nào sau này cũng phải thêm method cho nó thoả mãn Model thì thôi dùng Model luôn cho nhanh

vấn đề là bản thân Model cũng là 1 generics class => phải add thêm Type cho nó nữa, pass cái gì vào bây giờ => thêm 1 type K cho View, ko phải là để dùng cho bên trong class, mà là để làm generics type cho Model

*/

export abstract class View<T extends Model<K>, K> {
  regions: { [key: string]: Element } = {};

  constructor(public parent: Element, public model: T) {
    //tại sao ON CHANGE lại nằm ở constructor: when we create an instance of View class, we want to listen to the model that gets passed in, and listen specifically to the 'change' event. Nên split thành helper method, just want to keep constructor as simple as possibble
    this.bindModel();
  }

  //abstract eventsMap(): { [key: string]: () => void };
  /* provide default implementation inside eventsMap, vì UserShow extends View, trong khi UserShow ko cần eventsMap nên bỏ abstract đi đưa eventsMap về fn bthg, nếu mà để abstract ở đây thì ở UserShow sẽ phải define 1 cái eventsMap() { return{} } và return empty object chỉ để thoả mãn điều kiện của abstract class
  Đưa eventsMap về normal function, give it default functionality and can be optionally OVERWRITTEN by the child class 
  Bỏ abstract đi tức là nó thành cái method của View luôn chứ ko phải của child class nữa
  */

  abstract template(): string;

  eventsMap(): { [key: string]: () => void } {
    return {}; //eventsMap is no longer required to be implemented in the child class
  }

  //provide default implementation of regionsMap
  regionsMap(): { [key: string]: string } {
    return {};
  }

  //helper method
  bindModel(): void {
    this.model.on("change", () => {
      this.render();
    });
  }

  //helper fn
  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();
    for (let eventKey in eventsMap) {
      //eventKey is always a string
      const [eventName, selector] = eventKey.split(":");
      //find element in the fragment that matches selector, returns an array of all elements that match selector. Với mỗi element thì gắn 1 cái event listener, gồm tên event chính là eventName, và callback là value của eventsMap[eventKey], ví dụ như eventsMap['click:button'] sẽ là this.onButtonClick
      fragment.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventName, eventsMap[eventKey]);
      });
    }
  }

  /* for...in statement iterates over all enumerable properties of an object that are keyed by strings  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in */

  mapRegions(fragment: DocumentFragment): void {
    //1. get a reference to regionsMap
    const regionsMap = this.regionsMap();
    //2. iterate through the object and find all the selectors inside it
    for (let key in regionsMap) {
      const selector = regionsMap[key]; //.user-show or .user-form
      //3. find the element inside the template
      const element = fragment.querySelector(selector);
      if (element) {
        this.regions[key] = element;
      }
    }
  }

  onRender(): void {} //just a default implementation, the real nesting login is in UserEdit

  render(): void {
    this.parent.innerHTML = ""; //ban đầu ko có dòng này, mỗi lần render lại thêm 1 cục html mới, có dòng này thì khi render lại, vứt đống cũ đi thay thế bằng đống mới chứ ko nhân lên nữa. Với react hay angular thì nó sẽ tự compare DOM cũ và DOM mới nhưng mà làm thủ công thì làm thế này.

    //tạo ra 1 cái element gọi là template <template></template>
    const templateElement = document.createElement("template");
    //gắn đống html đc trả về ở trên vào templateElement
    templateElement.innerHTML = this.template(); //turns the string into actual html that is contained inside templateElement

    this.bindEvents(templateElement.content);
    this.mapRegions(templateElement.content);

    //SETUP VIEW NESTING, make sure everything nested before appending them to parent
    this.onRender();

    this.parent.append(templateElement.content);
    //content sẽ có type 'DocumentFragment'
  }
}

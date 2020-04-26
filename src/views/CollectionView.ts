import { Collection } from "../models/Collection";

export abstract class CollectionView<T, K> {
  constructor(public parent: Element, public collection: Collection<T, K>) {}

  abstract renderItem(model: T, itemParent: Element): void;

  render(): void {
    this.parent.innerHTML = "";
    const templateElement = document.createElement("template");

    for (let model of this.collection.models) {
      //1. build up a parent element
      const itemParent = document.createElement("div");
      //2. pass itemPrent to renderItem, create a view and attach it to itemParent
      this.renderItem(model, itemParent);
      //3. now we have a div with some html inside it, append it to the big list templateElement
      templateElement.content.append(itemParent);
    }

    //4. when we iterate over models, take the templateElement and append it to the CollectionView's parent
    this.parent.append(templateElement.content);
  }
}

/*
vì collection là generics class phải pass vào T,K cơ mà muốn thế thì CollectionView cũng phải là generics class thì mới có cái mà pass xuống cho con

CollectionView is like super class, used to create any type of Collection View, it has a method called renderItem() that takes some instance of model and reference to some HTML Element (whre we want to render the view). It will be up to the child class to implement the renderItem.

render() method will iterate over collection, for every MODEL inside that collection, we're gonna call renderItem to build up a VIEW for each single MODEL and render to the screen.
*/

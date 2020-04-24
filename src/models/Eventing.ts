type Callback = () => void; //type alias for function that takes no arg and returns no value

export class Eventing {
  events: { [key: string]: Callback[] } = {};
  //dùng để store các event listeners, là object có key là string, value là 1 dãy chứa các callback, initial value là empty object

  on = (eventName: string, callback: Callback): void => {
    //register new event listeners and trigger them some time in the future. phải handle cả trường hợp có callback và undefined
    const handlers = this.events[eventName] || [];
    handlers.push(callback);
    //assign the callback back to event
    this.events[eventName] = handlers;
  };

  trigger = (eventName: string): void => {
    const handlers = this.events[eventName]; //có thể undefined đối với những event chưa đc register
    if (!handlers || handlers.length === 0) {
      return;
    }

    //loop qua từng callback and call them
    handlers.forEach((callback) => {
      callback();
    });
  };
}

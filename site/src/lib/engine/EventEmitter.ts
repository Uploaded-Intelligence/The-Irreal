type Callback = (...args: any[]) => void;

export class EventEmitter {
  callbacks: { [key: string]: Callback[] };

  constructor() {
    this.callbacks = {};
  }

  on(_name: string, _callback: Callback) {
    // Errors: 'values' does not exist on type 'Object'
    const names = _name.split(' ');
    
    names.forEach((name) => {
        if (!this.callbacks[name]) {
            this.callbacks[name] = [];
        }
        this.callbacks[name].push(_callback);
    });

    return this;
  }

  off(_name: string, _callback: Callback) {
     const names = _name.split(' ');

     names.forEach((name) => {
         if (this.callbacks[name]) {
             this.callbacks[name] = this.callbacks[name].filter((cb) => cb !== _callback);
         }
     });

     return this;
  }

  trigger(_name: string, _args: any[] = []) {
    if (this.callbacks[_name]) {
      this.callbacks[_name].forEach((callback) => {
        callback.apply(this, _args);
      });
    }
  }
}

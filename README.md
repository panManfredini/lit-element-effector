# lit-element-effector
Mixin to add an Effector Store to lit-element.

- Automatically request element update on effector store change
- Support typescipt 
- Support a pattern for inheritance
- Safe: makes a copy of the store into the lit-elemet property `$`.

# Usage 

```js
const store = createStore( {greetings:"hello"});
const changeGreeting = createEvent();
store.on(changeGreeting, (_,p) => p );


class testClass extends EffectorMxn( LitElement, store ){
    
    render(){
        // the store state is copied into the `$` property
        return html`<h1> ${this.$.greetings} world! </h1>`
    }
}
```

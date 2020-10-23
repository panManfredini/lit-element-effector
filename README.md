# lit-element-effector
Mixin to attach an Effector Store to lit-element.

- Automatically request element update on effector store change.
- Supports typescript.
- It's just a tiny wrapper, about [1kB minified](https://bundlephobia.com/result?p=lit-element-effector@latest).
- Supports a pattern for inheritance.
- Safe: makes a copy of the store into the custom element.

# Usage 

```ts

EffectorMxn( BaseClass, Store, EffectAPI = undefined ) => class extends BaseClass

```
The mixin takes as input parameters a `BaseClass` which must inherit from a `LitElement`, an Effector `Store` and an optional object, `EffectAPI`.
This last one is meant as dependency injection of the custom-element's effect interface, its values are expected to be 
either effector `effects` or `events` (or in general functions).


```js
import {EffectorMxn} from "lit-element-effector"
import {html, LitElement} from "lit-element"
import {createEvent, createStore} from "effector"

const store = createStore( {greetings:"hello"} );

class example01 extends EffectorMxn( LitElement, store ){
    render(){
        // the store state is available with the `$` property
        return html`<h1> ${this.$.greetings} world! </h1>`
    }
}

customElements.define("example-01",example01);
```
The provided store is reflected to the LitElement property **$**. Supports any store types, from boolean to objects. 
The store state is deeply-copied to **$**. Direct assignment to the property **$** should be avoided, altough it cannot affect the state.


### Event and Effect API Helper

```js
const evnt = createEvent<string>();
store.on( evnt, (_,p)=> {greetings:p} );
const API = { changeGreetings : evnt } ;

class example02 extends EffectorMxn(LitElement, store, API){
    render(){
        return html`
            <h1> ${this.$.greetings} world! </h1>
            <button @click="${this.clickme}"></button>
        `
    }

    clickme(){
        // the effects API is available under `dispatch` prop
        this.dispatch.changeGreetings("Hey");
    }
}

```

This is no more than a reccomendation. The effect API is injected into the `dispatch` getter property, this
helps a bit with decoupling (see an example in the test section below). In some cases can be more convenient to override the `dispatch` getter,
if you do so is a good practice to return a shallow copy of the API object (which could be used in multiple places).

### React on Store change with user defined function

```js

class example03 extends EffectorMxn(LitElement, store){
    
    on_store_update(stateCopy)
    {
        /* Do something on update */
    }
    render() { /* render component */ }
}
```

In case the user define the function `on_store_update`, this will be executed any time a store change is triggered.
The only argument is passed to the funation is a copy of the current store. This function will run after the property **$** is 
set, but before any element update/render.

### Inheritance

### Testing Helpers


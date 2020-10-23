# lit-element-effector
Mixin to attach an Effector Store to lit-element.

- Automatically request element update on effector store change.
- Support typescript.
- It's just a tiny wrapper, about [1kB minified](https://bundlephobia.com/result?p=lit-element-effector@0.1.0).
- Support a pattern for inheritance.
- Safe: makes a copy of the store into the custom element.

# Usage 

```ts

EffectorMxn( BaseClass, Store, EffectAPI = undefined ) => class extends BaseClass

```
The mixin takes as input parameters a `BaseClass` which must inherit from a `LitElement`, an Effector `Store` and an optional object, `EffectAPI`.
This last one helps building an interface between the state change API and the custom-element, its values are expected to be 
either effector `effects` or `events`.


```js
import {EffectorMxn} from "lit-element-effector"
import {html, LitElement} from "lit-element"
import {createStore} from "effector"

const store = createStore( {greetings:"hello"} );

class example01 extends EffectorMxn( LitElement, store ){
    render(){
        // the store state is available with the `$` property
        return html`<h1> ${this.$.greetings} world! </h1>`
    }
}

customElements.define("example-01",example01);
```
The provided store is reflected to the LitElement property [ $ ](). Supports any store types, from boolean to objects. 
The store state is deep-copied to [ $ ](). Direct assignment to the property [ $ ]() should be avoided, altough they wont effect the state.


### Event and Effect API Helper

### React on Store change with user defined function

### Inheritance

### Testing Helpers
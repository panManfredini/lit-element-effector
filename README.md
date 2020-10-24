# lit-element-effector
Minimal mixin to attach an [Effector](https://effector.now.sh/) Store to [lit-element](https://lit-element.polymer-project.org/).

- Automatically request element update on effector store change.
- Supports typescript.
- Just a tiny wrapper, about [1kB minified](https://bundlephobia.com/result?p=lit-element-effector@latest).
- Supports a pattern for inheritance.
- Safe: makes a copy of the store into the custom element.
- Built with testing in mind.

# Usage 

```ts

EffectorMxn( BaseClass, Store, FX_API = undefined ) => class extends BaseClass

```
The mixin takes as input parameters a `BaseClass` which must inherit from a `LitElement`, an Effector `Store` and an optional object, `FX_API`.
This last one is meant as dependency injection of the custom-element's effect interface, its values are expected to be 
either effector `effects` or `events` (or functions).


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
The provided store is reflected to the LitElement property **$**. Supports any store types, from boolean to objects. 
The store state is deeply-copied to **$**. Direct assignment to the property **$** should be avoided, altough it cannot affect the state.


### Event and Effect API Helper

```js
import {createEvent, createEffect} from "effector"

const evnt = createEvent<string>();
const Fx = createEffect(/* some network call*/);

store01.on( evnt, (_,p)=> { return {greetings:p} } );
const API = { changeGreetings : evnt, networkCallFx : Fx } ;

class example02 extends EffectorMxn(LitElement, store01, API){
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

If defined, the effect API is injected into the `dispatch` getter property. This is no more than a recommendation, 
it helps to keep the custom-element decoupled from the app-state (see an example in the test section below). 
In some cases can be more convenient to override the `dispatch` getter, if you do so is a good practice to return 
a shallow copy of the API object (since it could be used in multiple places).

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

If defined, the function `on_store_update` will be executed any time a store change is triggered.
The only argument passed to the function is a copy of the current store. This function will run after the property **$** is 
set, but before any of the element's update/render.

### Inheritance

```js

import {combine} from "effector";
const store02 = createStore( {username:"Alex"} )
const combinedStore = combine(store01,store02, (a,b) => Object.assign({}, a,b) );

// here applying the mixing to the previous example class
class example04 extends EffectorMxn(example01, combinedStore){ 
    
    // adding a reflected attribute on top of the inherited ones
    @property() type = "dark"
    
    render(){
        return html `
            ${super.render()}
            <p class="${this.type}"> This is ${this.$.username}. </p>
        `
    }
}

```
LitElement makes sure that reflected properties of inherited classes are present and functioning. One thing to notice is that when 
applying the mixin multiple times the store is actually swapped, so the provided store of a child class must be a combination 
of the parent store and the additional wanted properties.

### Testing Helpers

```ts
      it("Detaches from current store", async ()=>{

        var ex01 = <example01>document.createElement("example-01");

        // this detaches from store (replace with undefined)
        ex01.replaceStore();

        // the element is not initialized until it is connected
        // so usually one need to attach it to the DOM for testing
        // (in this specific case is not needed tough)
        document.body.appendChild(ex01);
        await ex01.updateComplete;  // needed if you want to check renders

        expect(ex01.$).to.be.undefined

        // you can use this to simulate a store update 
        // best to run this before appendChild
        ex01.store_update_handler( {greetings: "Ciao" } );

        expect(ex01.$).to.deep.equal( {greetings: "Ciao" } );
    });


```
There are a few convenient helpers to aid testing a custom-element with attached store. A function `replaceStore` is provided to swap the store with a fake one.
The `store_update_handler` function can be used to simulate a store update.

```js
  it("Reassign the event API",()=>{
        customElements.define("example-02",example02);
        var ex02 = document.createElement("example-02");
        
        ex02.dispatch.networkCallFx = ( ) => {};

        document.body.appendChild(ex02);

        /* go on with network related call disabled */

    });

```
Many times during testing we would mock or stub effects that make network calls, here you can simply reassign the instance API. 
The `dispatch` getter returns a shallow copy of the effect-API, this means that you can swap the keys of that instance with fakes without 
affecting the overall element class nor the original effect-API.
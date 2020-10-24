import { expect } from '@open-wc/testing';


// ----------------  EXAMPLE 01 ---------------------------//
import {EffectorMxn} from "../"
import {html, LitElement, property} from "lit-element"
import {createEvent, createStore} from "effector"

const store01 = createStore( {greetings:"hello"} );

class example01 extends EffectorMxn( LitElement, store01 ){
    render(){
        // the store state is available with the `$` property
        return html`<h1> ${this.$.greetings} world! </h1>`
    }
}

customElements.define("example-01",example01);




// ----------------  EXAMPLE 02 ---------------------------//

const evnt = createEvent<string>();
store01.on( evnt, (_,p)=> { return {greetings:p} } );
const API = { changeGreetings : evnt } ;

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


// ----------------  EXAMPLE 03 ---------------------------//

class example03 extends EffectorMxn(LitElement,store01){
    
    on_store_update(stateCopy:any)
    {
        /* Do something on update */
    }
    render() { /* render component */ }
}



// ----------------  EXAMPLE 04 ---------------------------//

import {combine} from "effector";
const store02 = createStore( {username:"Alex"} )
const combinedStore = combine(store01,store02, (a,b) => Object.assign({}, a,b) );

// here applying the mixing to the previous example class
class example04 extends EffectorMxn(example01,combinedStore){ 
    
    // adding a reflected attribute on top of the inherited ones
    @property() type = "dark"
    
    render(){
        return html `
            ${super.render()}
            <p class="${this.type}"> This is ${this.$.username} </p>
        `
    }
}


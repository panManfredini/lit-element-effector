import { expect } from '@open-wc/testing';

import {EffectorMxn} from "../src"
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


class example03 extends EffectorMxn(LitElement,store){
    
    on_store_update(stateCopy)
    {
        /* Do something on update */
    }
    render() { /* render component */ }
}
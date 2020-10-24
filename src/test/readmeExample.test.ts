import { expect } from '@open-wc/testing';

/**
 * Test suite that makes sure what's on README works and 
 * people can simply copy paste
 */



// ----------------  EXAMPLE 01 ---------------------------//
import {EffectorMxn} from "../"
import {html, LitElement, property} from "lit-element"
import {createStore} from "effector"

const store01 = createStore( {greetings:"hello"} );

class example01 extends EffectorMxn( LitElement, store01 ){
    render(){
        // the store state is available with the `$` property
        return html`<h1> ${this.$.greetings} world! </h1>`
    }
}

customElements.define("example-01",example01);




// ----------------  EXAMPLE 02 ---------------------------//
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

customElements.define("example-02",example02);

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




describe("Testing Readme examples",()=>{

    beforeEach(()=>{
        evnt("hello");
    })

    it("expects exampe 01 to have dom rendered",async ()=>{
        var ex01 = <example01>document.createElement("example-01");
        document.body.appendChild(ex01);
        await ex01.updateComplete;

        expect(ex01).shadowDom.equal('<h1> hello world! </h1>')
    });

    it("expects example 02 to change state on click",async ()=>{
        var ex02 = <example02>document.createElement("example-02");
        document.body.appendChild(ex02);
        await ex02.updateComplete;
        ex02.shadowRoot.querySelector("button").click();
        await ex02.updateComplete;

        expect(ex02).shadowDom.equal('<h1> Hey world! </h1> <button></button>')
        
    })

// --------------- EXAMPLE 05 -----------------------------//
    it("Detaches from current store",()=>{

        var ex01 = <example01>document.createElement("example-01");

        // this detaches from store (replace with undefined)
        ex01.replaceStore();

        // the element is not initialized until it is connected
        // so usually one need to attach it to the DOM for testing
        // (in this specific case is not needed tough)
        document.body.appendChild(ex01);

        expect(ex01.$).to.be.undefined

        // you can use this to simulate a store update 
        // best to run this before appendChild
        ex01.store_update_handler( {greetings: "Ciao" } );
        expect(ex01.$).to.deep.equal( {greetings: "Ciao" } );
    });


    it("Reassign the event API",async ()=>{
        //customElements.define("example-02",example02);
        var ex02 = <example02>document.createElement("example-02");
        
        // @ts-expect-error
        ex02.dispatch.networkCallFx = ( ) => {};
        // @ts-expect-error
        ex02.dispatch.changeGreetings = ( ) => {};

        document.body.appendChild(ex02);
        await ex02.updateComplete;

        ex02.shadowRoot.querySelector("button").click();
        expect(ex02.$.greetings).to.equal("hello");
        
        // no change in main API object
        expect(API.networkCallFx).to.equal(Fx);
        
    });
})
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// ----------------  EXAMPLE 01 ---------------------------//
import { EffectorMxn } from "../";
import { html, LitElement, property } from "lit-element";
import { createEvent, createStore } from "effector";
const store01 = createStore({ greetings: "hello" });
class example01 extends EffectorMxn(LitElement, store01) {
    render() {
        // the store state is available with the `$` property
        return html `<h1> ${this.$.greetings} world! </h1>`;
    }
}
customElements.define("example-01", example01);
// ----------------  EXAMPLE 02 ---------------------------//
const evnt = createEvent();
store01.on(evnt, (_, p) => { return { greetings: p }; });
const API = { changeGreetings: evnt };
class example02 extends EffectorMxn(LitElement, store01, API) {
    render() {
        return html `
            <h1> ${this.$.greetings} world! </h1>
            <button @click="${this.clickme}"></button>
        `;
    }
    clickme() {
        // the effects API is available under `dispatch` prop
        this.dispatch.changeGreetings("Hey");
    }
}
// ----------------  EXAMPLE 03 ---------------------------//
class example03 extends EffectorMxn(LitElement, store01) {
    on_store_update(stateCopy) {
        /* Do something on update */
    }
    render() { }
}
// ----------------  EXAMPLE 04 ---------------------------//
import { combine } from "effector";
const store02 = createStore({ username: "Alex" });
const combinedStore = combine(store01, store02, (a, b) => Object.assign({}, a, b));
// here applying the mixing to the previous example class
class example04 extends EffectorMxn(example01, combinedStore) {
    constructor() {
        super(...arguments);
        // adding a reflected attribute on top of the inherited ones
        this.type = "dark";
    }
    render() {
        return html `
            ${super.render()}
            <p class="${this.type}"> This is ${this.$.username} </p>
        `;
    }
}
__decorate([
    property()
], example04.prototype, "type", void 0);

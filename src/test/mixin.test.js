import { EffectorMxn } from "../index.js";
import { createEvent, createStore, restore } from "effector";
import { expect } from '@open-wc/testing';
import { html, LitElement } from "lit-element";
describe("Specs for routedView", () => {
    var el01;
    const event = createEvent();
    const default_data = { name: "ciao", age: 7, obj: { a: 1, b: 2 } };
    const _store = restore(event, default_data);
    var usrStoreUpdate = {};
    class t_class extends EffectorMxn(LitElement, _store, { test: event }) {
        static get properties() {
            return { testProp: { attribute: false, reflect: false } };
        }
        constructor() {
            super();
            this.testProp = "zero";
        }
        on_store_update(stateCopy){ usrStoreUpdate = stateCopy };
        render() {
            return html `${this.$.name} ${this.$.obj.a} ${this.$.obj.b}`;
        }
    }
    before(() => {
        customElements.define("t-gv-01", t_class);
    });
    beforeEach(() => {
        el01 = document.createElement("t-gv-01");
        document.body.appendChild(el01);
    });
    afterEach(() => {
        document.body.removeChild(el01);
    });
    it("Can create", () => {
        expect(el01).to.exist;
    });
    it("On Startup Store prop `$` and additional user defined prop data are well  defined", () => {
        expect(el01.$).to.deep.equal(default_data);
        expect(el01.testProp).to.deep.equal("zero");
    });
    it("On startup the user defined function is called with datata that is a copy of state",()=>{
        expect(usrStoreUpdate).to.deep.equal(default_data);
        expect(usrStoreUpdate).not.equal(default_data);
    });
    it("On store data change, data is set, also user defined function is called", () => {
        event({ name: "pip", age: 7, obj: { a: 3, b: 12 } });
        expect(el01.$.name).to.equal("pip");
        expect(el01.$.age).to.equal(7);
        expect(el01.$.obj).to.deep.equal({ a: 3, b: 12 });
        expect(usrStoreUpdate).to.deep.equal({ name: "pip", age: 7, obj: { a: 3, b: 12 } });
    });
    it("Changing directly the property does not effect the store", () => {
        event({ name: "pipo", age: 12, obj: { a: 3, b: 18 } });
        expect(el01.$.name).to.equal("pipo");
        expect(el01.$.age).to.equal(12);
        expect(el01.$.obj).to.deep.equal({ a: 3, b: 18 });
        el01.$.name = "paul";
        el01.$.age = 57;
        el01.$.obj.a = 73;
        expect(_store.getState()).to.deep.equal({ name: "pipo", age: 12, obj: { a: 3, b: 18 } });
    });
    it("Dispatch events", () => {
        el01.dispatch.test(default_data);
        expect(_store.getState()).to.deep.equal(default_data);
        expect(el01.$).to.deep.equal(default_data);
    });
    it("Inherits correctly props from a parent class", () => {
        class testClass extends EffectorMxn(t_class, createStore({ c:89, name: "ciao", obj: { a: 1, b: 2 } })) {
        }
        customElements.define("t-gv-02", testClass);
        var el02 = document.createElement("t-gv-02");
        document.body.appendChild(el02);
        expect(el02).to.exist;
        expect(el02.testProp).to.equal("zero");
        expect(el02.$.c).to.equal(89);
        expect(el02.$.age).to.not.exist; // check for override of store (only prop not rendered in t_class)
        expect(el02.dispatch.test).to.equal(event);
    });
});

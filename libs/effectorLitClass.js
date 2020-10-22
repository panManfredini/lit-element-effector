var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, property } from 'lit-element';
export class effectorLit extends LitElement {
    constructor() {
        super(...arguments);
        this.$ = undefined;
    }
    connectedCallback() {
        this.$;
        if (super.connectedCallback)
            super.connectedCallback();
        this.useStore();
    }
    useStore() {
        this._watcherPointer = this.store.watch(this._on_store_update.bind(this));
    }
    disconnectedCallback() {
        if (super.disconnectedCallback)
            super.disconnectedCallback();
        this._watcherPointer.unsubscribe();
    }
    _on_store_update(currentState) {
        var stateCopy = this._deepCopyObject(currentState);
        this._reflectStoreToProperty(stateCopy);
        this._userReactionToStoreUpdate(stateCopy);
    }
    _userReactionToStoreUpdate(current_data) {
        if (this.on_store_update) {
            this.on_store_update(current_data);
            this.requestUpdate();
        }
    }
    _reflectStoreToProperty(current_data) {
        /*for (const p of Object.keys(current_data)) {
            if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), p)) {
                //@ts-ignore
                this[p] = current_data[p];
            }
        }*/
        this.$ = current_data;
    }
    _deepCopyObject(data) {
        let cases = ["number", "boolean", "string", "null", "undefined"];
        if (cases.includes(typeof data))
            return data;
        var copy = {};
        for (const [key, value] of Object.entries(data)) {
            if (cases.includes(typeof value)) {
                copy[key] = value;
            }
            else if (typeof value === "object") {
                copy[key] = JSON.parse(JSON.stringify(value));
            }
        }
        return copy;
    }
}
__decorate([
    property({ attribute: false, reflect: false })
], effectorLit.prototype, "$", void 0);

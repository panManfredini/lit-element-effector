export function EffectorMxn(BaseClass, EffectorStore, API = undefined) {
    return class extends BaseClass {
        constructor() {
            super(...arguments);
            this.$ = undefined;
        }
        static get properties() {
            return { $: { attribute: false, reflect: false } };
        }
        get store() {
            return EffectorStore;
        }
        get dispatch() {
            //@ts-ignore
            if (super.dispatch && API === undefined)
                return super.dispatch;
            else
                return API;
        }
        connectedCallback() {
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
            //@ts-expect-error
            if (this.on_store_update) {
                //@ts-expect-error
                this.on_store_update(current_data);
                this.requestUpdate();
            }
        }
        _reflectStoreToProperty(current_data) {
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
    };
}

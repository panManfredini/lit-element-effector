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
            var _a;
            this._watcherPointer = (_a = this.store) === null || _a === void 0 ? void 0 : _a.watch(this.store_update_handler.bind(this));
        }
        disconnectedCallback() {
            var _a;
            if (super.disconnectedCallback)
                super.disconnectedCallback();
            (_a = this._watcherPointer) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        }
        store_update_handler(currentState) {
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

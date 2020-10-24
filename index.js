/**
 * Mixin to attach an Effector Store to a lit-element web-component. On store change the element will be
 * automatically updated. The store is reflected in the property `$`.
 * @param BaseClass Class inheriting from LitElement
 * @param EffectorStore Store
 * @param effectAPI Optional event/effect interface that will be injected in property `dispatch`. It must be an obect whose values are functions or effetcs.
 */
export function EffectorMxn(BaseClass, EffectorStore, effectAPI = undefined) {
    return class extends BaseClass {
        constructor() {
            super();
            this.$ = undefined;
            this._watcherPointer = undefined;
            // @ts-expect-error
            this._apiCopy = Object.assign({}, effectAPI, super.dispatch);
            this._storePointer = EffectorStore;
        }
        static get properties() {
            return { $: { attribute: false, reflect: false } };
        }
        /**
         * Getter that returns a pointer to the associated effector store
         */
        get store() {
            return this._storePointer;
        }
        /**
         * Getter that returns a shallow copy of the injected effect/event API
         */
        get dispatch() {
            return this._apiCopy;
        }
        /**
         * Replace the store with another one and subscribes to it. Usefull during testing, in case one wants to swapp with a fake store.
         * @param store new Store
         */
        replaceStore(store = undefined) {
            var _a;
            (_a = this._watcherPointer) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            this._storePointer = store;
            this.useStore();
        }
        connectedCallback() {
            if (super.connectedCallback)
                super.connectedCallback();
            this.useStore();
        }
        /**
         * Subscribes to the store.
         */
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
        /**
         * Actual function that is subscribed to store chages. Call this
         * function if you want to simulate a store update.
         * @param currentState
         */
        store_update_handler(currentState) {
            var stateCopy = this._deepCopyObject(currentState);
            this._reflectStoreToProperty(stateCopy);
            this._userReactionToStoreUpdate(stateCopy);
        }
        /**
         * Calls the user defined update function on store trigger.
         * @param current_data
         */
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
        /**
         * Does a deep copy of the provided object. Used to copy the store state.
         * @param data data to be copied
         */
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

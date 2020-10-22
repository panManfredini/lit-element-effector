import type {LitElement} from "lit-element"
import type {Store, Subscription, Effect,Event} from "effector"

type ExtendedlitElement = {
    properties? : object
    new(): LitElement
}

type effectAPI = { [key:string]:(Effect<any,any,any>| Event<any> | ((i:any)=>void) )}

export function EffectorMxn<X,Q extends effectAPI>( BaseClass: ExtendedlitElement, EffectorStore:Store<X>, API:Q = undefined ) {
    return class extends BaseClass {
        
        $:X = undefined;
        _watcherPointer: Subscription;

        static get properties() {
            let returnPorps = { $ : {attribute:false, reflect:false} } ;
            if(super.properties)
                return Object.assign({}, super.properties, returnPorps);
            else returnPorps;
        }
        
        get store(): Store<X> {
            return EffectorStore;
        }
        
        get dispatch() {
            return API;   
        }
            
        connectedCallback(){
            if(super.connectedCallback) super.connectedCallback();
            this.useStore();
        }
    
        useStore(){
            this._watcherPointer =  this.store.watch(this._on_store_update.bind(this)) ;
        }
    
        disconnectedCallback(){
            if(super.disconnectedCallback) super.disconnectedCallback();
            this._watcherPointer.unsubscribe();
        }
    
        _on_store_update(currentState:X){
            var stateCopy = this._deepCopyObject(currentState);
            this._reflectStoreToProperty(stateCopy);
            this._userReactionToStoreUpdate(stateCopy);
        }
    
        _userReactionToStoreUpdate(current_data:any){
            //@ts-expect-error
            if (this.on_store_update) 
            {
                //@ts-expect-error
                this.on_store_update(current_data);
                this.requestUpdate();
            }
        }
    
        _reflectStoreToProperty(current_data:any){
            this.$ = current_data;
        }
    
        _deepCopyObject<U>(data:U):U{
            let cases = ["number","boolean","string","null","undefined"]; 
            if(cases.includes(typeof data)) return data;
            
            var copy:any = {};
            for (const [key, value] of Object.entries(data)) {
                if(cases.includes(typeof value))
                {
                    copy[key] = value;
                }
                else if(typeof value === "object" )
                {
                    copy[key] = JSON.parse(JSON.stringify(value));
                }
            }
       
            return copy ;
        }

    }
}

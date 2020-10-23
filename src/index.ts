import  {LitElement} from "lit-element"
import {Store, Subscription, Effect,Event, createEvent, createStore} from "effector"

export type ExtendedlitElement = {
    new(): LitElement
}

export interface effectAPI  { [key:string]:(Effect<any,any,any>| Event<any> | ((i:any)=>void) | ((i:any)=>Promise<any>)) }

export function EffectorMxn<X,Q extends effectAPI>( BaseClass: ExtendedlitElement, EffectorStore:Store<X>, API:Q = undefined ) {
    return class extends BaseClass {
        
        $:X = undefined;
        _watcherPointer: Subscription;

        static get properties() {
            return { $ : {attribute:false, reflect:false} } ;
        }
        
        get store(): Store<X> {
            return EffectorStore;
        }
        
        get dispatch() : Q {
            //@ts-ignore
            if(super.dispatch && API === undefined)  return super.dispatch;
            else return API;   
        }
            
        connectedCallback(){
            if(super.connectedCallback) super.connectedCallback();
            this.useStore();
        }
    
        useStore(){
            this._watcherPointer =  this.store?.watch(this.store_update_handler.bind(this)) ;
        }
    
        disconnectedCallback(){
            if(super.disconnectedCallback) super.disconnectedCallback();
            this._watcherPointer?.unsubscribe();
        }
    
        store_update_handler(currentState:X){
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





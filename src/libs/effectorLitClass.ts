import {LitElement, property} from 'lit-element';
import type {Store, Subscription, Event, Effect } from "effector"


export abstract class effectorLit<T> extends LitElement 
{
    
    _watcherPointer: Subscription;
    abstract get store() : Store<T> 
    abstract get dispatch() : { [key:string] : Event<any> | Effect<any,any,any> }

    @property( {attribute:false, reflect:false}) $:T = undefined;
    
    on_store_update?: (state:T) => void

    connectedCallback(){
        this.$
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

    _on_store_update(currentState:T){
        var stateCopy = this._deepCopyObject(currentState);
        this._reflectStoreToProperty(stateCopy);
        this._userReactionToStoreUpdate(stateCopy);
    }

    _userReactionToStoreUpdate(current_data:any){
        if (this.on_store_update) 
        {
            this.on_store_update(current_data);
            this.requestUpdate();
        }
    }

    _reflectStoreToProperty(current_data:any){
        /*for (const p of Object.keys(current_data)) {
            if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), p)) {
                //@ts-ignore
                this[p] = current_data[p];        
            }
        }*/
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

import {EffectorMxn} from "../index.js"
import {LitElement} from "lit-element"
import {createEvent,restore} from "effector"

describe("Specs for routedView",()=>{
    
    var el01;
    const event = createEvent();
    const _store = restore(event, {name:"ciao", age:7, obj : {a:1, b:2}}); 

    class t_class extends EffectorMxn(LitElement,_store,{test:event}){
        
        render(){
            return html`${this.$.name} ${this.$.age} ${this.$.obj.a} ${this.$.obj.b}`
        }
    }    

    before(()=>{
        customElements.define("t-gv-01",t_class);
    });

    after(()=>{
        localStorage.clear();
    })
    
    beforeEach(()=>{
        el01 = document.createElement("t-gv-01");
        document.body.appendChild(el01);
    });

    afterEach(()=>{
        document.body.removeChild(el01);
    });

    it("Can create",()=>{
        expect(el01).to.exist;
    });

/*    it("On viewData change, data is NOT set if route is NOT current_route",()=>{
        event({name:"ciccio", age:17, obj:{a:3,b:4}});
        expect(el01.$.name).to.equal("");
        expect(el01.$.age).to.equal(0);
        expect(el01.$.obj).to.deep.equal({a:0,b:1});
    });

    it("On request set route to current_route, it is shown and data is set",async ()=>{

        API_Request.update({location:"/test"});
        expect(el01.getAttribute("show")).to.equal("true");
        expect(el01.$.name).to.equal("ciccio");
        expect(el01.$.age).to.equal(17);
        expect(el01.$.obj).to.deep.equal({a:3,b:4});
    });

    it("On viewData change, data is set if route is current_route",()=>{
        event({name:"pip", age:7, obj:{a:3,b:12}});
        expect(el01.$.name).to.equal("pip"); expect(el01.$.age).to.equal( 7 ) ;
        expect(el01.$.obj).to.deep.equal({a:3,b:12});
    });

    it("Changing directly the property does not effect the store",()=>{
        event({name:"pip", age:7, obj:{a:3,b:12}});
        expect(el01.$.name).to.equal("pip"); expect(el01.$.age).to.equal( 7 ) ;
        expect(el01.$.obj).to.deep.equal({a:3,b:12});
        el01.$.name = "paul"
        el01.$.age = 57;
        el01.$.obj.a = 73;
        expect(_store.getState()).to.deep.equal({ name:"pip", age:7, obj:{a:3,b:12} })
    });

    it("On route change to other route the view is not shown and view is cleared", async ()=>{
        API_Request.update({location:"/testo"});
        expect(el01.getAttribute("show")).to.equal("false");
        expect(el01.$.name).to.equal(""); expect(el01.$.age).to.equal( 0 );
        expect(el01.$.obj).to.deep.equal({a:0,b:0});
    });

  */  
})

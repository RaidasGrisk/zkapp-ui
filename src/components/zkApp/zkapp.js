var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { state, State, method, PublicKey, Field, SmartContract, } from 'o1js';
// here's the idea: we have a math question: 10 / 2 + 2
// if you give a correct answer, the state will update
// and set value var to the publicKey a caller provided
class SimpleZkapp extends SmartContract {
    constructor() {
        super(...arguments);
        this.value = State();
    }
    giveAnswer(answer, value) {
        // below a simple math question: 10 / 2 + 2
        // lets check if given answer is correct
        answer.assertEquals(Field(10).div(2).add(2));
        // whoever manages to solve this and knows the answer
        // can prove this withought actually sharing the answer
        // i.e the answer you provide, never leaves your local env
        // imagine if the computation cost required to find / check
        // the answer was high. zkapp let us do all the compute
        // on the client side, and then send the proof over to the network!
        // if assertion passes, update state
        let value_ = this.value.get();
        this.value.assertEquals(value_);
        this.value.set(value);
    }
}
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], SimpleZkapp.prototype, "value", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, PublicKey]),
    __metadata("design:returntype", void 0)
], SimpleZkapp.prototype, "giveAnswer", null);
export { SimpleZkapp };
//# sourceMappingURL=zkapp.js.map
import { State, PublicKey, Field, SmartContract } from 'o1js';
declare class SimpleZkapp extends SmartContract {
    value: State<PublicKey>;
    giveAnswer(answer: Field, value: PublicKey): void;
}
export { SimpleZkapp };

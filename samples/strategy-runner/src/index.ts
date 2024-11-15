import {antworker, Strategy} from "@antl4b/antworker-crypto-algo-trading";

class MyStrat extends Strategy {
    override beforeLoop(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    override loop(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    override afterLoop(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    override cleanup(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

const app = antworker();

app.setStrategy(new MyStrat());

app.runStrategy();
import { antworker, logInfo, Strategy, Utils } from "@antl4b/antworker-crypto-algo-trading";

class MyStrat extends Strategy {
  override async beforeLoop(): Promise<void> {
    logInfo("beforeLoop (nothing)");
  }
  override async loop(): Promise<void> {
    logInfo("loop (nothing), waiting 10 sec");
    await Utils.delay(10000);
  }
  override async afterLoop(): Promise<void> {
    logInfo("afterLoop (nothing)");
  }
  override async cleanup(): Promise<void> {
    logInfo("Cleaning up (nothing)");
  }
}

const app = antworker();

app.setStrategy(new MyStrat());

app.runStrategy();

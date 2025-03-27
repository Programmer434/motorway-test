export class ApiStateCounter {
  private static instance: ApiStateCounter;
  private errorCount = 0;
  private successCount = 0;
  private shouldUseFailover: boolean = false;
  private failOverTTLInSeconds = 300;
  private failOverTTLTriggerTime: Date;
  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ApiStateCounter();
    return this.instance;
  }

  public incrementSuperCarErrorCount() {
    this.errorCount++;
  }

  private getErrorCountPercent() {
    return this.errorCount / (this.errorCount + this.successCount);
  }

  public incrementSuperCarSuccessCount() {
    this.successCount++;
  }

  //TODO set a minimum threshold for failover
  public getPreferredClient() {
    const errorCountPercent = this.getErrorCountPercent();
    if (errorCountPercent > 50) {
      this.shouldUseFailover = true;
      this.failOverTTLTriggerTime = new Date();
      this.failOverTTLTriggerTime.setSeconds(
        this.failOverTTLTriggerTime.getSeconds() + this.failOverTTLInSeconds,
      );
    }

    if (this.shouldUseFailover && this.failOverTTLTriggerTime > new Date()) {
      return 'premiumCarClient';
    } else {
      this.shouldUseFailover = false;
      return 'superCarClient';
    }
  }
}

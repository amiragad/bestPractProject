import { PurchaseRebateModule } from './purchase-rebate.module';

describe('PurchaseRebateModule', () => {
  let purchaseRebateModule: PurchaseRebateModule;

  beforeEach(() => {
    purchaseRebateModule = new PurchaseRebateModule();
  });

  it('should create an instance', () => {
    expect(purchaseRebateModule).toBeTruthy();
  });
});

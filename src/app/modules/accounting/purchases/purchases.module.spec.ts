import { PurchasesModule } from './purchases.module';

describe('PurchasesModule', () => {
  let purchasesModule: PurchasesModule;

  beforeEach(() => {
    purchasesModule = new PurchasesModule();
  });

  it('should create an instance', () => {
    expect(purchasesModule).toBeTruthy();
  });
});

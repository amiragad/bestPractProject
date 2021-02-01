import { StockManagementModule } from './stock-management.module';

describe('StockManagementModule', () => {
  let stockManagementModule: StockManagementModule;

  beforeEach(() => {
    stockManagementModule = new StockManagementModule();
  });

  it('should create an instance', () => {
    expect(stockManagementModule).toBeTruthy();
  });
});

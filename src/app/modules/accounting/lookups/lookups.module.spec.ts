import { LookupsModule } from './lookups.module';

describe('LookupsModule', () => {
  let lookupsModule: LookupsModule;

  beforeEach(() => {
    lookupsModule = new LookupsModule();
  });

  it('should create an instance', () => {
    expect(lookupsModule).toBeTruthy();
  });
});

import { SystemDataModule } from './system-data.module';

describe('SystemDataModule', () => {
  let systemDataModule: SystemDataModule;

  beforeEach(() => {
    systemDataModule = new SystemDataModule();
  });

  it('should create an instance', () => {
    expect(systemDataModule).toBeTruthy();
  });
});

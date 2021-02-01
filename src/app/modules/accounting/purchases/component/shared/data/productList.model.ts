import { BaseObject } from "../../../../../../modules/accounting/suppliers/shared/data/base-object.model";

export class purchaseProductList {
    id: number;
    productCode: any;
    productAmount: number;
    productPrice: number;
    productDiscount: number;
    productTotalValue: number;
    productVat: number;
    product: BaseObject;
    productUnit: BaseObject;
    productUnitId: any;
    productId: any;
    unitId: any;
    unit: any;
    isDeleted: any;
    isEdited: Boolean;
}

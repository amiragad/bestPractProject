import { OutputPermissionProduct } from "./output-permission-product";

export class OutputPermission {
   BookCode:string;
   InventoryId:number;
   Notes:string;
   inventoryProducts:OutputPermissionProduct[];
}

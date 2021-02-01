import { RosterSlice } from "./rosterslice.model";

export class AddEditRoster{
    id:number;
    code:string;
    nameAr:string;
    nameEn:string;
    active:boolean;
    rosterType :boolean;
   target :number;
   percentage:number;
   slices:RosterSlice[]
}
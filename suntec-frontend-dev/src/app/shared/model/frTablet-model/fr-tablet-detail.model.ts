import { FloorDetail } from "../floor-model/floor-detail.model";

export class FrTabletDetail {

    id:number = 0;  
    name!:String; 
    floorName!:FloorDetail; 
    protocol!:String;  
    ip!:String;  
    port!:String;  
    account!:String;  
    createdDate!: Date;  
    updateDate!:Date;
}

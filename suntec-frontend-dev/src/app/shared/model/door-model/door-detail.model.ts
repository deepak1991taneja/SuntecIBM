import { FloorDetail } from "../floor-model/floor-detail.model";

export class DoorDetail {
    id:number = 0;  
    doorName!:String;  
    floorName!:FloorDetail; 
    range!:String;  
    companyName!:String;
    endPointName!:String;
    createdDate!: Date;  
    updateDate!:Date;
}

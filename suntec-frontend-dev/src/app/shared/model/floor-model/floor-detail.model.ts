import { BuildingDetail } from "../building-model/building-detail";

export class FloorDetail {
    id:number = 0;  
    buildingName!:BuildingDetail;  
    floorName!:String; 
    floor!:String;  
    createdDate!: Date;  
    updateDate!:Date;
}

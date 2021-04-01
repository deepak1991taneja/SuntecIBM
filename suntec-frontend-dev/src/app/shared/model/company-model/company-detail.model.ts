import { FloorDetail } from "../floor-model/floor-detail.model";

export class CompanyDetail {
    id:number = 0;  
    companyName!:String;  
    floor!:FloorDetail; 
    contactPerson!:String;  
    unitNumber!:String;
    contactNumber!:String[];
    createdDate!: Date;  
    updateDate!:Date;
}

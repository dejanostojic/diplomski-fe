import { Climber } from "../climber.model";
import { RegistrationFee } from "./registration-fee.model";

export interface Registration{
    registrationFee: RegistrationFee;
    climber: Climber;
    startNumber: number;
    total_ord: number;
    paid: boolean;
    createdDate: Date;
    paidDate: Date;
}
import { RegistrationFee } from "./registration-fee.model";
import { Registration } from "./registration.model";
import { Route } from "./route.model";

export interface Competition {  
    id?: number;
    name: string;
    description: string;
    registrationOpen?: Date;
    registrationClose?: Date;
    eventStart?: Date;
    registrationFees: RegistrationFee[];
    routes: Route[];
    registrations: Registration[];
}

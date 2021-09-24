import {FormMode} from "./form-mode.model"

export class FormUtils{
    static isEditable(mode: FormMode){
        return mode === FormMode.FORM_ADD || mode === FormMode.FORM_EDIT;
    };

    static shouldFetchData(mode: FormMode){
        return mode === FormMode.FORM_VIEW || mode === FormMode.FORM_EDIT;
    };

    static isUpdate(mode: FormMode){
        return mode === FormMode.FORM_EDIT;
    }

    static isInsert(mode: FormMode){
        return mode === FormMode.FORM_ADD;
    }
} 

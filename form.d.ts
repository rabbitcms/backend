import { State, ValidationOptions } from "rabbitcms/backend";
import AjaxSettings = DataTables.AjaxSettings;
export interface FormOptions {
    validation?: ValidationOptions;
    ajax?: AjaxSettings | boolean;
    completeSubmit: () => void;
    state?: State;
    dialog?: BootboxDialogOptions | boolean;
}
export declare class Form {
    private options;
    private form;
    private data;
    private match;
    constructor(form: JQuery, options?: FormOptions);
    syncOriginal(): void;
    getData(): string;
    submitForm(): void;
}

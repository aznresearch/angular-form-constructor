export interface FormField {
  type:
    | "text"
    | "date"
    | "checkbox"
    | "dropdown"
    | "controlWithLabel"
    | "dropZone";
  label: string;
  name: string;
  validators?: any[];
  options?: any[];
}

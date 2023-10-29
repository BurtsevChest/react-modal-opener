import { CustomClassOpenerOptions } from "../../types";

/**
 * Additional options for opening a modal window
 */
export interface AdditionalDialogOptions {
   wrapperClassName?: string;
   modal?: boolean;
}

/**
 * Options for opening a modal dialog box that opens in the center of the screen
 */
export type DialogOpenerOptions = CustomClassOpenerOptions & AdditionalDialogOptions;

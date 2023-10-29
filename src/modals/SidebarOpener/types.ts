import { CustomClassOpenerOptions } from "../../types";

export interface AdditionalSidebarOptions {
   /**
    * The position from which the sidebar opens is on the right by default
    */
   position?: 'top' | 'left' | 'right' | 'bottom';

   /**
    * The duration of the animation with which the sidebar will open/close
    */
   animationDuration?: number;

   /**
    * The name of the class that will be hung on the body of the sidebar (not on the external wrapper, with a dark background, but on the sidebar itself)
    */
   wrapperClassName?: string;

   /**
    * Flag, indicates whether to make the window modal (hide the rest of the interface with a dark background)
    */
   modal?: boolean;
}

/**
 * Options for opening the sidebar
 */
export type SidebarOpenerOptions = CustomClassOpenerOptions & AdditionalSidebarOptions;

import React from "react";

/**
 * The type of the loaded component (a function that returns a dynamic import of the component)
 */
export type LoadComponent = () => Promise<{ default: React.ComponentType<any> }>;

/**
 * Component loaded using React.lazy. It needs to be passed to Sucspense
 */
export type LazyLoadedComponent = React.LazyExoticComponent<React.ComponentType<any>>;

/**
 * Name of the modal window type
 */
export type ModalType = string;

/**
 * Styles sent to the modal window component
 * Each modal window manages these styles in its own way
 */
export type ModalStyles = React.CSSProperties;

/**
 * Unique identifier of the modal window
 */
export type ModalID = number;

/**
 * Modal Window status
 */
export type ModalStatus = boolean;

/**
 * Hooks triggered when opening/closing a modal window
 */
export type ModalHandlers = {
   /**
    * @param id Unique identifier of the modal window
    * @returns It will work when the modal window is opened
    */
   onOpen?: (id: ModalID) => void;

   /**
    * @returns It will work when the modal window is closed
    */
   onClose?: () => void;
}

/**
 * Additional options for opening a modal window
 */
export type ModalOtherOptions = object;

/**
 * The name of the window to open. It is necessary, for example, not to reopen the modal window, but to change the already open one
 * To change the open window, you must specify the same name, but other props. Then the already open window will change. It makes no sense to change the insertion component or other options, the change will be made only with the changed props, and the unchanged name.
 * The comparison also occurs by type. For example, you can specify the same name for SidebarOpener and DialogOpener, but they will not conflict. Comparison occurs only between modal windows of the same type
 */
export type ModalName = string;

/**
 * Basic interface for the modal window component
 * It should be expanded with additional options
 */
export interface IBaseModalComponent {
   /**
    * Unique identifier of the modal window
    */
   id: ModalID;

   /**
    * Modal Window status
    */
   status: ModalStatus;

   /**
    * Styles sent to the modal window component
    * Each modal window manages these styles in its own way
    */
   styles: ModalStyles;

   /**
    * A custom component will be placed here
    */
   children: React.ReactNode;
}

/**
 * This is the Base
 */
export interface Base {
   /**
    *  The name of the window to open. It is necessary, for example, not to reopen the modal window, but to change the already open one
    */
   name: ModalName;

   /**
    * The props that will be placed in the downloadable component
    */
   props?: object;

   /**
    * Styles sent to the modal window component
    * Each modal window manages these styles in its own way
    */
   styles?: ModalStyles;

   /**
    * Handlers onOpen: (id) => void and onClose: () => void handlers triggered when opening/closing a modal window
    */
   handlers?: ModalHandlers;
}

/**
 * Basic interface of function arguments for opening a modal window
 */
export interface ModalOpenerOptions<T> extends Base {
   /**
    * A function that returns the import of a custom component
    */
   Component: LoadComponent;

   /**
    * A function that returns the import of a modal window component
    */
   ModalComponent: LoadComponent;

   /**
    * Name of the modal window type
    */
   type: ModalType;

   /**
    * Other options that will be passed to the modal window. Each type of modal window implements these options by itself.
    */
   otherOptions?: T;
}

/**
 * The basic interface for new functions of opening new modals, is expanded by an additional list of otherOptions
 */
export interface CustomClassOpenerOptions extends Base {
   Component: LoadComponent;
}

/**
 * Interface of a single element of an array of modal windows
 */
export interface BaseModalItem<T> extends Base {
   /**
    * Component loaded using React.lazy. It needs to be passed to Sucspense
    */
   Component: LazyLoadedComponent;

   /**
   * Component loaded using React.lazy. It needs to be passed to Sucspense
   */
   ModalComponent: LazyLoadedComponent;

   /**
    * Name of the modal window type
    */
   type: ModalType;

   /**
    * Other options that will be passed to the modal window. Each type of modal window implements these options by itself.
    */
   otherOptions?: T;

   /**
    * Unique identifier of the modal window
    */
   id: ModalID;

   /**
    * Modal Window status
    */
   status: ModalStatus;
}

import React from "react";
import { LoadComponent, ModalID, CustomClassOpenerOptions, BaseModalItem, ModalName } from "../types";
import { OpenerController } from "../ui/ModalsContainer";

/**
 * Basic interface of the modal window opening function. It should be used as the basis for the function of opening a specific modal window
 */
export interface BaseOpenerOptions<T> extends CustomClassOpenerOptions {
   otherOptions?: T;
}

/**
 * The abstract class of the base opener for opening modal windows. The rest of the modal windows should be inherited from this class
 */
export abstract class BaseOpener<T> {
   /**
    * The component of the modal window that will be used to open this type of modal window
    */
   protected abstract modalComponent: LoadComponent;

   /**
    * Name of the modal window type
    */
   protected abstract type: string;

   /**
    * Default styles of the modal window component
    */
   abstract defaultStyles: React.CSSProperties;

   /**
    * The function of closing the modal window. Each type of the opener class implements the method in its own way
    * @param id ID of the modal window
    */
   abstract close(id: ModalID): void;

   /**
    * Options required to open a modal window. They should be expanded using additional options of a specific modal window
    * @param options 
    */
   open(options: BaseOpenerOptions<T>) {
      OpenerController.open<T>({
         Component: options.Component,
         ModalComponent: this.modalComponent,
         type: this.type,
         name: options.name,
         styles: options.styles || this.defaultStyles,
         handlers: options.handlers,
         otherOptions: options.otherOptions,
         props: options.props,
      });
   }

   /**
    * @param id ID of the modal window 
    * @returns Returns an element from the list of open modal windows by the specified id
    */
   static getElementById<T>(id: ModalID): BaseModalItem<T> | undefined {
      return OpenerController.getElementByID<T>(id);
   }

   /**
    * @param id ID of the modal window
    * @param duration Delay time before closing
    * Closes the modal window after the allotted time, after changing the status of the modal window with the given id
    */
   static animateClose(id: ModalID, duration: number): void {
      OpenerController.animateClose(id, duration);
   }

   /**
   * @param name Name of the modal window
   * @returns Deletes all modal windows with the specified name
   */
   static closeByName(name: ModalName): void {
      OpenerController.closeByProperty('name', name);
   }

   /**
   * @returns Closes all modal windows
   */
   static closeAll(): void {
      OpenerController.closeAll();
   }

   /**
    * @returns Deletes all modal windows with a specific type
    */
   closeByType(): void {
      OpenerController.closeByProperty('type', this.type);
   }
}

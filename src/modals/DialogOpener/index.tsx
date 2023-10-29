import React from 'react';
import { OpenerController } from "../../ui/ModalsContainer";
import { AdditionalDialogOptions, DialogOpenerOptions } from "./types";
import { LoadComponent, ModalID } from "../../types";
import { BaseOpener, BaseOpenerOptions } from '../../lib/BaseOpener';

/**
 * Helper for opening modal dialog boxes located in the center of the screen.
 * 
 * ```ts
 * import { DialogOpener } from 'react-modal-opener';
 * 
 * const myDialog = new DialogOpener();
 * 
 * myDialog.defaultStyles = {
 *    boxShadow: '0 0 15px rgba(128, 128, 128, 0.3)',
 *    minWidth: '500px',
 *    minHeight: '500px',
 *    backgroundColor: '#272c35',
 * }
 * 
 * myDialog.defaultAnimationDuration = 500;
 * 
 * const ReactComponent = () => {
 *    const openDialog = () => {
 *       myDialog.open({
            Component: () => import('path/to/my/component'),
            name: 'MainDialog',
            props: {
               title: 'Hello Dialog',
               sendData: (data) => {
                  console.log('data: ' + data);
               }
            },
            styles: {
               backgroundColor: 'white',
               borderRadius: '--dialog-main-br',
            },
            handlers: {
               onOpen: (id) => {
                  console.log('Dialog opened, dialog id: ' + id);
               },
               onClose: () => {
                  console.log('Dialog closed');
               }
            },
            wrapperClassName: 'MyClassName'
         });
 *    }
 *
 *    return (
 *       <button onClick={openDialog}>Open Dialog</button>
 *    );
 * }
 * ```
 */
export class DialogOpener extends BaseOpener<AdditionalDialogOptions> {
   protected modalComponent: LoadComponent = () => import('./template');
   protected type: string = 'dialog';
   /**
    * Styles applied to the body of the modal window
    */
   defaultStyles: React.CSSProperties = {
      boxShadow: 'rgb(0 0 0 / 40%) 0px 0px 40px',
      minWidth: '200px',
      minHeight: '200px',
      backgroundColor: 'white'
   };

   /**
    * Opens a modal dialog box
    * @param options DialogOpenerOptions - options for opening a dialog box
    */
   open(options: DialogOpenerOptions) {
      const dialogData: BaseOpenerOptions<AdditionalDialogOptions> = {
         ...options,
         otherOptions: {
            wrapperClassName: options?.wrapperClassName || '',
            modal: options?.modal,
         }
      }
      super.open(dialogData);
   }

   /**
    * Closes the modal dialog box by the specified id
    * @param id ID of the modal window
    */
   close(id: ModalID) {
      DialogOpener.dialogClose(id);
   }

   static dialogClose(id: number): void {
      OpenerController.close(id);
   }
}

import React from 'react';
import { AdditionalSidebarOptions, SidebarOpenerOptions } from './types';
import { BaseOpener, BaseOpenerOptions } from '../../lib/BaseOpener';
import { LoadComponent } from '../../types';

/**
 * Helper for opening sidebars.
 * 
 * ```ts
 * import { SidebarOpener } from 'react-modal-opener';
 * 
 * const mySidebar = new SidebarOpener();
 * 
 * mySidebar.defaultStyles = {
 *    boxShadow: '0 0 15px rgba(128, 128, 128, 0.3)',
 *    minWidth: '500px',
 *    minHeight: '500px',
 *    backgroundColor: '#272c35',
 * }
 * 
 * mySidebar.defaultAnimationDuration = 500;
 * 
 * const ReactComponent = () => {
 *    const openSidebar = () => {
 *       mySidebar.open({
            Component: () => import('path/to/my/component'),
            name: 'simpleSidebar',
            props: {
               title: 'Hello Sidebar',
               sendData: (data) => {
                  console.log('data: ' + data);
               }
            },
            styles: {
               backgroundColor: 'white',
            },
            handlers: {
               onOpen: (id) => {
                  console.log('Sidebar opened, sidebar id: ' + id);
               },
               onClose: () => {
                  console.log('Sidebar closed');
               }
            },
            position: 'left',
            animationDuration: 600,
            wrapperClassName: 'MyClassName',
            modal: true
         });
 *    }
 *
 *    return (
 *       <button onClick={openSidebar}>OpenSidebar</button>
 *    );
 * }
 * ```
 */
export class SidebarOpener extends BaseOpener<AdditionalSidebarOptions> {
   protected modalComponent: LoadComponent = () => import('./template');
   protected type: string = 'sidebar';
   defaultStyles: React.CSSProperties = {
      boxShadow: '0 0 15px rgba(128, 128, 128, 0.3)',
      minWidth: '200px',
      minHeight: '200px',
      backgroundColor: 'white',
   };

   /**
    * Default duration of the sidebar opening/closing animation
    */
   defaultAnimationDuration: number = 400;

   /**
    * Opens the sidebar in a given position, styles and duration of animation
    * @param options SidebarOpenerOptions — options required to open the sidebar
    */
   open(options: SidebarOpenerOptions) {
      const sidebarData: BaseOpenerOptions<AdditionalSidebarOptions> = {
         ...options,
         otherOptions: {
            position: options.position || 'right',
            animationDuration: options.animationDuration === 0 ? 0 : this.defaultAnimationDuration,
            wrapperClassName: options?.wrapperClassName,
            modal: options?.modal
         }
      };
      super.open(sidebarData);
   }

   /**
    * @param id ID of the open sidebar
    * @param name If name is specified, then all windows (not only the sidebar!) with this name will close together with the sidebar
    */
   close(id: number) {
      SidebarOpener.sidebarClose(id);
   }

   /**
    * @param id ID of the open sidebar
    * @returns Closes the sidebar according to its animation
    */
   static sidebarClose(id: number): void {
      const duration: number | undefined = BaseOpener.getElementById<AdditionalSidebarOptions>(id)?.otherOptions?.animationDuration;

      if (duration) {
         BaseOpener.animateClose(id, duration);
      }
   }
}

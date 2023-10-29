# react-modal-opener
This is a library for opening modal windows.

You can use one of the ready-made modal windows (for example, SidebarOpener or DialogOpener), or create your own custom dialog box.

## Installing / Getting started
This package is available in NPM repository as react-modal-opener. It will work correctly with all popular bundlers.

````
npm i react-modal-opener
````

## Connect ModalWrapper and styles
````
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'app/App';
import { ModalWrapper } from 'react-modal-opener';
import 'react-modal-opener/dist/index.css';

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
   <ModalWrapper>
      <App/>
   </ModalWrapper>
);

or 

root.render(
   <SomeProvider>
      <ModalWrapper/>
      <App/>
   </SomeProvider>
);
````

## Usage
### Open sidabar
````
import { SidebarOpener } from "react-modal-opener";

export const sidebar = new SidebarOpener();

sidebar.defaultStyles = {
   boxShadow: 'rgb(0 0 0 / 40%) 0px 0px 40px',
   minWidth: '700px',
   minHeight: '700px',
   backgroundColor: 'white',
   padding: '20px'
}

const MyComponent = () => {
   const openSidabar = () => {
      sidebar.open({
         Component: () => import(./SidebarComponent');
         name: 'MainSidebar',
         props: {
            title: 'Hello Sidebar!',
            sendData: (data) => {
               console.log('Sended data: ' + data);
            }
         },
         handlers: {
            onOpen: (id) => {
               console.log('Sidebar opened. Sidebar id: ' + id);
            },
            obClose: () => {
               // some code
            }
         },
         animationDiration: 600,
         wrapperClassName: 'SomeClassName',
         position: 'left',
         modal: true
      });
   }

   return (
      <buttton click={openSidabar}>Open Sidebar</button>
   )
}
````

### Close sidabar
The component that you imported always receives an "id" - the ID of the modal window in which the component was placed. 

Use the "id" and the same class instance to close the modal window.

The closing animation can be implemented for different modal windows. If you have opened a modal window using a SidebarOpener instance, then close it using it.
````
import { sidebar } from './MyComponent';

const SidebarComponent = ({title, sendData, id}) => {
   const closeSidebar = () => {
      sidebar.close(id);
   }

   const buttonClickHandler = () => {
      sendData('I sended data');
   }

   return (
      <h2>{title}</h2>
      <button onClick={buttonClickHandler}>Send Data</button>
      <button onClick={closeSidebar}>Close Sidebar</button>
   )
}
````

## What is Name?
The name is intended so that you can not open a new modal window, but **change an already open one**.

For example. You have a list of some elements, and you need to open a modal window by clicking on each element of this list. But for each element it is the same modal window, but with different props. You can come up with a name for your modal window. And run the function to open a window with the same name, but with different props.

Different modal windows will not conflict with each other.

For example, if you open a window using DialogOpener with different props and the same name, it will not affect the modal window that you open using SidebarOpener in any way

## Demo
Example of using SidebarOpener and DialogOpener

![Demo example of using libraries.](https://github.com/BurtsevChest/react-modal-opener/blob/main/docs/images/demo.gif?raw=true)

## Custom Opener
Below is an example of a simple implementation of a simple custom modal window

### Custom Opener Class
````
import React from 'react';
import { CustomClassOpenerOptions, LoadComponent, BaseOpener } from 'react-modal-opener';

<!-- Additional options belonging to a specific modal window -->
export interface AdditionalCustomOptions {
   animationDuration?: number;
   modal?: boolean;
}

<!-- The interface of the object that will be used to open a custom modal window -->
export type CustomOpenerOptions = CustomClassOpenerOptions & AdditionalCustomOptions;

export class CustomOpener extends BaseOpener<AdditionalCustomOptions> {
   <!-- Specifying the modal window component -->
   protected modalComponent: LoadComponent = () => import('../modals/CustomOpener/template');
   <!-- Coming up with a name for the type of modal window -->
   type = 'custom';

   <!-- Not obligatory -->
   <!-- Specifying default styles for the modal window component -->
   defaultStyles: React.CSSProperties = {
      boxShadow: '0 0 15px rgba(128, 128, 128, 0.3)',
      minWidth: '200px',
      minHeight: '200px',
      backgroundColor: 'white',
   };

   <!-- Not obligatory -->
   <!-- This is already a custom option, it is not provided by default. And its implementation falls on the shoulders of the developer -->
   <!-- You can specify the default value here and substitute it in the open function, or you can specify it in the template component itself as the initial value -->
   defaultAnimationDuration: number = 400;

   <!-- Redefine the opening method if you need to change some input parameters. If you don't need to add any additional parameters (these are the ones in AdditionalCustomOptions), then you can not override this method -->
   open(options: CustomOpenerOptions): void {
      const sidebarData: BaseOpenerOptions<AdditionalCustomOptions> = {
         ...options,
         <!-- Mandatory "otherOptions", this is where all the additional parameters of the modal window will go -->
         otherOptions: {
            animationDuration: options?.animationDuration || this.defaultAnimationDuration,
            modal: options?.modal
         }
      }
      super.open(sidebarData);
   }

   <!-- Each modal window implements the closing method in its own way -->
   close(id: number): void {
      CustomOpener.customClose(id);
   }

   <!-- In this example, I decided to do it through a static method, because the method does not particularly depend on a specific instance of the class -->
   static customClose(id: number): void {
      <!-- Get the duration of the animation, which was saved in "otherOptions" -->
      const duration: number | undefined = BaseOpener.getElementById<AdditionalCustomOptions>(id)?.otherOptions?.animationDuration;

      <!-- Calling the delayed closure of the modal window -->
      if (duration) {
         BaseOpener.animateClose(id, duration);
      }
   }
}
````

### Custom Opener Component
````
import React, { useEffect, useRef } from "react";
import { IBaseModalComponent } from "../../types";
import { AdditionalCustomOptions, CustomOpener } from ".";

<!-- Use IBaseModalComponenr and previously created additional options to create a props interface for a custom modal window component -->
type TCustom = IBaseModalComponent & AdditionalCustomOptions;

<!-- The component of the custom modal window itself -->
const Custom: React.FC<TCustom> = ({ id, children, status, styles, animationDuration = 400, modal }) => {
   const ref = useRef<HTMLDivElement>(null);
   const close = () => {
      if (modal) {
         CustomOpener.customClose(id);
      }
   }

   <!-- Setting a css variable indicating the animation time of opening/closing the modal window -->
   useEffect(() => {
      ref.current?.style.setProperty("--custom_template-animation-duration", `${animationDuration / 1000}s`);
   }, [animationDuration]);

   return (
      <div
         ref={ref}
         onClick={close} className={(modal ? 'Custom-wrapper ' : '') + (!status ? `Custom-wrapper-close` : '')}
      >
         <div
            onClick={e => { e.stopPropagation() }}
            style={styles}
            className={'Custom ' + (!status ? `Custom-close` : '')}
         >
            {children}
         </div>
      </div>
   )
}

/**
 * Custom modal dialog
 */
export default React.memo(Custom);

````

## BaseOpener Class Interface

````
interface BaseOpener {
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
   open(options: BaseOpenerOptions<T>): void;

   /**
    * @param id ID of the modal window 
    * @returns Returns an element from the list of open modal windows by the specified id
    */
   static getElementById<T>: (id: ModalID): BaseModalItem<T> | undefined;

   /**
    * @param id ID of the modal window
    * @param duration Delay time before closing
    * Closes the modal window after the allotted time, after changing the status of the modal window with the given id
    */
   static animateClose: (id: ModalID, duration: number): void;

   /**
   * @param name Name of the modal window
   * @returns Deletes all modal windows with the specified name
   */
   static closeByName: (name: ModalName): void;

   /**
   * @returns Closes all modal windows
   */
   static closeAll: (): void;
}
````
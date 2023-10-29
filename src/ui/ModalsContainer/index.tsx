import React from "react";
import { BaseModalItem, ModalOpenerOptions, ModalID, ModalType, ModalName } from "../../types";
import { isEqual } from "../../helpers/isEqual";
import ZIndex from "../ZIndex";

export type IModalList = BaseModalItem<unknown>[];

/**
 * Interface of methods passed to the singleton controller
 */
export interface IOpenerConfig {
   open: <T>(options: ModalOpenerOptions<T>) => void;
   close: (id: ModalID) => void;
   closeAll: () => void;
   prepareToClose: (id: ModalID) => void;
   changeModal: <T>(id: ModalID, options: ModalOpenerOptions<T>) => void;
   getElementByID: <T>(id: ModalID) => BaseModalItem<T> | undefined;
   closeByName: (name: ModalName) => void;
   animateClose: (id: ModalID, duration: number) => void;
}

interface IModalContainerState {
   modalList: IModalList;
   startZindex: number;
}

/**
 * Component-wrapper of all modal windows. The list of open modal windows will be drawn in it. 
 * All actions with modal windows occur in this component.
 * The functions used to manage the modal list are passed to the methods of the singleton class described below.
 * Management and interaction with modal windows occurs through this singleton class.
 * For a specific type of modal window (for example, a sidebar), a wrapper class is written that interacts with this singleton. 
 */
class ModalContainer extends React.Component<{startZindex?: number}, IModalContainerState> {
   constructor(props: {startZindex: number}) {
      super(props);
      this.state = {
         modalList: [],
         startZindex: props.startZindex || 1,
      };
   }
   //@ts-ignore
   private opener: OpenerController | null;

   /**
    * @param options New Modal Window Options
    * @returns The function lazily loads the component and the modal window, generates data and adds it to the array of modal windows, then runs handler onOpen if it has been passed
    */
   private addModal<T>(options: ModalOpenerOptions<T>): void {
      const UserComponent = React.lazy(options.Component);
      const ModalComponent = React.lazy(options.ModalComponent);
      const newIndex = this.getNewIndex();

      this.setState({
         modalList: [
            ...this.state.modalList,
            {
               Component: UserComponent,
               ModalComponent: ModalComponent,
               handlers: {
                  onClose: options?.handlers?.onClose,
                  onOpen: options?.handlers?.onOpen,
               },
               id: newIndex,
               status: true,
               props: options?.props,
               name: options?.name,
               type: options?.type,
               styles: options?.styles,
               otherOptions: options?.otherOptions,
            }
         ]
      });
      options?.handlers?.onOpen?.(newIndex);
   }

   /**
    * @returns Returns a new index for the modal window.
    * In fact, the function finds the last open modal window, takes its id and adds 1 to it
    * This is necessary so that no more than one window with the same id is opened. Because each id is passed to the Zindex component, the modal window and the component itself
    * This helps to avoid unnecessary redrawing and errors related to the order of the window
    * You cannot use the array index as a key!
    * If an element can be removed from the array not from the end (but for example from the middle) then all the elements standing after the deleted element will receive new indexes (which will cause redrawing of all these elements), although they should not change (because the components of the modal window are exported via Reac.memo)
    * Also, due to the use of the array index, an error may occur when the modal window receives the wrong index that it actually has. And as a result, the index will not be able to close this modal window
    */
   private getNewIndex(): number {
      if (this.state.modalList.length > 0) {
         // TODO: Object is possibly undefined
         return (this.state.modalList.at(-1)?.id || 0) + 1;
      }
      return 0;
   };

   /**
    * @param id ID of the modal window
    * @param props New props
    * @returns The function changes the props to the modal window with the task id.
    */
   changeModal<T>(id: ModalID, options: ModalOpenerOptions<T>): void {
      this.setState({
         modalList: this.state.modalList.map(modal => {
            if (modal.id === id) {
               // Changing the necessary properties
               modal.handlers = options.handlers;
               modal.otherOptions = options.otherOptions;
               modal.props = options.props;
               modal.styles = options.styles;

               // We launch onOpen, if suddenly such a one came
               options.handlers?.onOpen?.(id);
            }
            return modal;
         })
      });
   }

   /**
    * @param props Props for the component
    * @param type Type of modal window to open
    * @param name Name of the modal window
    * @returns The function determines what to do with the window opening request (change one of the open ones, open a new one, or do nothing)
    */
   private canOpenOrChange(props: object | undefined, type: ModalType, name: ModalName): 'open' | number | undefined {
      const isOpenModal = this.state.modalList.findIndex(modal => modal.name === name && modal.type != type);
      const isNewOpener = this.state.modalList.findIndex(modal => modal.name === name);

      if (this.state.modalList.length === 0 || isOpenModal !== -1 || isNewOpener === -1) {
         return 'open';
      }

      const isChangeModal = this.state.modalList.findIndex(modal => modal.type === type && modal.name === name && !isEqual(modal.props, props));

      if (isChangeModal != -1) {
         return isChangeModal;
      }

      return undefined;
   }

   /**
    * @param LoadedComponent The component that needs to be lazily loaded
    * @param options Options required to open a modal window
    * @returns Based on the results of the 'canOpenOrChange' function, it calls the function of opening or changing the modal window.
    */
   open<T>(options: ModalOpenerOptions<T>): void {
      const getResultByOptions = this.canOpenOrChange(options.props, options.type, options.name);

      if (getResultByOptions === 'open') {
         this.addModal<T>(options);
         return;
      }

      if (typeof getResultByOptions === 'number') {
         this.changeModal<T>(getResultByOptions, options);
         return;
      }
   }

   /**
    * @param id ID of the modal window
    * @returns The function changes the 'status' option at the modal window with the specified id.
    * For example, it may be necessary to warn the modal window about the upcoming closure.
    * In response to the change of the 'status' request, the modal window can perform its actions (start closing animations, etc.)
    * @attention The function does not close the modal window, but only changes the value of 'status' to false
    */
   prepareToClose(id: ModalID): void {
      this.setState({
         modalList: this.state.modalList.map(modal => {
            if (modal.id === id) {
               modal.status = false;
            }
            return modal;
         })
      });
   }

   /**
    * @param id ID of the modal window
    * @returns Returns an array element (modal window with its options, etc. if it is open)
    */
   getElementByID<T>(id: ModalID): BaseModalItem<T> | undefined {
      return this.state.modalList.find(modal => modal.id === id) as BaseModalItem<T>;
   }

   /**
    * @param id ID of the modal window
    * @returns Closes the modal window by pre-launching handler onClose if it has been passed.
    */
   close(id: ModalID): void {
      this.state.modalList[id]?.handlers?.onClose?.();
      this.setState({
         modalList: this.state.modalList.filter((Modal) => Modal.id !== id)
      });
   }

   /**
    * Closes all modal windows
    */
   closeAll(): void {
      this.setState({
         modalList: [],
      })
   }

   /**
    * @param id ID of the modal window
    * @param duration Delay time before closing
    * Closes the modal window after the allotted time, after changing the status of the modal window with the given id
    */
   animateClose(id: ModalID, duration: number): void {
      this.prepareToClose(id);

      setTimeout(() => {
         this.close(id);
      }, duration);
   }

   /**
    * @param name Name of the modal window
    * @returns Deletes all modal windows with the specified name
    */
   closeByName(name: ModalName) {
      this.setState({
         modalList: this.state.modalList.filter(modal => modal.name !== name)
      });
   }

   componentDidMount(): void {
      // Linking our component to the singleton
      this.opener = new OpenerController({
         open: this.open.bind(this),
         close: this.close.bind(this),
         closeAll: this.closeAll.bind(this),
         closeByName: this.closeByName.bind(this),
         getElementByID: this.getElementByID.bind(this),
         prepareToClose: this.prepareToClose.bind(this),
         changeModal: this.changeModal.bind(this),
         animateClose: this.animateClose.bind(this),
      });
   }

   componentWillUnmount(): void {
      this.opener?.destroy();
   }

   render(): React.ReactNode {
      return (
         <div id="popup" style={{ position: 'fixed' }}>
            {this.state.modalList.map(Modal => {
               return (
                  <ZIndex
                     id={Modal.id}
                     startZindex={this.state.startZindex}
                     key={Modal.id}
                  >
                     {/* TODO: we do not make a loader, because for some reason, with two lazy components, it constantly pops up, simulating a delay, although there is none at all, it's better to show an empty diva that nothing blinked*/}
                     <React.Suspense fallback={<div></div>}>
                        <Modal.ModalComponent
                           id={Modal.id}
                           status={Modal.status}
                           styles={Modal.styles}
                           // @ts-ignore
                           {...Modal.otherOptions}
                        >
                           <Modal.Component
                              id={Modal.id}
                              {...Modal?.props}
                           />
                        </Modal.ModalComponent>
                     </React.Suspense>
                  </ZIndex>
               )
            })}
         </div>
      );
   }
}

/**
 * A wrapper containing a container with modal windows can be wrapped over something, or you can simply place it next to it
 * 
 * Usage:
 * ```ts
 * import { ModalWrapper } from 'react-modal-opener';
 * import ReactDOM from 'react-dom/client';
   import App from './app/App';

   ReactDOM.createRoot(document.getElementById('root')!).render(
      <ModalWrapper>
         <App/>
      <ModalWrapper>
   );

   or

   ReactDOM.createRoot(document.getElementById('root')!).render(
      <SomeProvider>
         <ModalWrapper/>
         <App/>
      </SomeProvider>
   );
 * ```
 */
export const ModalWrapper: React.FC<{ children?: React.ReactNode, startZindex?: number }> = ({ children, startZindex }) => {
   if (!children) {
      return <ModalContainer startZindex={startZindex} />
   }
   return (
      <>
         <ModalContainer startZindex={startZindex} />
         {children}
      </>
   )
}

/**
 * Singleton-controller for managing the state of the modal window container
 */
export class OpenerController {
   private static inst: OpenerController;
   private opener: IOpenerConfig | null = null;

   constructor(cfg: IOpenerConfig) {
      if (OpenerController.inst) {
         return OpenerController.inst;
      }
      this.opener = cfg;
      OpenerController.inst = this;
   }

   destroy() {
      this.opener = null;
   }

   /**
    * @param LoadedComponent The component that needs to be lazily loaded
    * @param options Options required to open a modal window
    * @returns По результатам выполнения функции 'canOpenOrChange' вызывает функцию открытия или изменения модального окна.
    */
   static open<T>(options: ModalOpenerOptions<T>) {
      if (OpenerController.inst.opener) {
         OpenerController.inst.opener.open(options);
      };
   }

   /**
    * @param id ID of the modal window
    * @returns Closes the modal window by pre-launching handler onClose if it has been passed.
    */
   static close(id: ModalID): void {
      if (OpenerController.inst.opener) {
         OpenerController.inst.opener.close(id);
      };
   }

   /**
    * @returns Closes all modal windows
    */
   static closeAll() {
      if (OpenerController.inst.opener) {
         OpenerController.inst.opener.closeAll();
      };
   }

   /**
    * @param id ID of the modal window
    * @returns The function changes the 'status' option at the modal window with the specified id.
    * For example, it may be necessary to warn the modal window about the upcoming closure.
    * In response to the change of the 'status' request, the modal window can perform its actions (start closing animations, etc.)
    * @attention The function does not close the modal window, but only changes the value of 'status' to false
    */
   static prepareToClose(id: ModalID) {
      if (OpenerController.inst.opener) {
         OpenerController.inst.opener.prepareToClose(id);
      };
   }

   /**
    * @param id ID of the modal window
    * @param props New props
    * @returns The function changes the props to the modal window with the task id.
    */
   static changeModal<T>(id: ModalID, options: ModalOpenerOptions<T>) {
      if (OpenerController.inst.opener) {
         OpenerController.inst.opener.changeModal(id, options);
      };
   }

   /**
    * @param id ID of the modal window
    * @returns Returns an array element (modal window with its options, etc. if it is open)
    */
   static getElementByID<T>(id: ModalID): BaseModalItem<T> | undefined {
      if (OpenerController.inst.opener) {
         return OpenerController.inst.opener.getElementByID(id) as BaseModalItem<T>;
      };
   }

   /**
    * @param name Name of the modal window
    * @returns Deletes all modal windows with the specified name
    */
   static closeByName(name: ModalName): void {
      if (OpenerController.inst.opener) {
         return OpenerController.inst.opener.closeByName(name);
      };
   }

   /**
    * @param id ID of the modal window
    * @param duration Delay time before closing
    * Closes the modal window after the allotted time, after changing the status of the modal window with the given id
    */
   static animateClose(id: ModalID, duration: number): void {
      if (OpenerController.inst.opener) {
         return OpenerController.inst.opener.animateClose(id, duration);
      };
   }
}

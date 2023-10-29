/**
 * Library of modal window openers (dialogs, sidebars, etc.)
 * @author Burtsev Ilya
 */

export {
   CustomClassOpenerOptions,
   LoadComponent,
   ModalType,
   ModalStyles,
   ModalStatus,
   ModalHandlers,
   ModalOpenerOptions,
   ModalName,
   IBaseModalComponent,
   Base,
   ModalOtherOptions
} from './types';
export { BaseOpener, BaseOpenerOptions } from './lib/BaseOpener';
export { SidebarOpenerOptions } from './modals/SidebarOpener/types';
export { DialogOpenerOptions } from './modals/DialogOpener/types';
export { ModalWrapper, OpenerController } from './ui/ModalsContainer';
export { SidebarOpener } from './modals/SidebarOpener';
export { DialogOpener } from './modals/DialogOpener';

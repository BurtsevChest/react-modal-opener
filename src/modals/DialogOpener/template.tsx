import React from "react";
import { IBaseModalComponent } from "../../types";
import { AdditionalDialogOptions } from "./types";
import { DialogOpener } from ".";
import './styles.css';

type TDialogModal = AdditionalDialogOptions & IBaseModalComponent;


const Dialog: React.FC<TDialogModal> = ({ children, id, wrapperClassName, modal = true, styles }) => {
   const close = () => {
      if (modal) {
         DialogOpener.dialogClose(id);
      }
   }
   
   return (
      <div onClick={close} className={'DialogModal-wrapper ' + wrapperClassName}>
         <div onClick={e => { e.stopPropagation() }} style={styles} className="DialogModal-body">
            {children}
         </div>
      </div>
   );
}

/**
 * Modal window that opens in the center of the screen
 */
export default React.memo(Dialog);

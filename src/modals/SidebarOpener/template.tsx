import React, { useEffect, useRef } from "react";
import './styles.css';
import { IBaseModalComponent } from "../../types";
import { AdditionalSidebarOptions } from "./types";
import { SidebarOpener } from ".";

type ISidebar = IBaseModalComponent & AdditionalSidebarOptions;

const Sidebar: React.FC<ISidebar> = ({ id, children, status, styles, position, animationDuration = 400, wrapperClassName, modal }) => {
   const ref = useRef<HTMLDivElement>(null);

   const close = () => {
      if (modal) {
         SidebarOpener.sidebarClose(id);
      }
   }

   useEffect(() => {
      ref.current?.style.setProperty("--sidebar-animation-duration", `${animationDuration / 1000}s`);
   }, [animationDuration]);

   return (
      <div
         ref={ref}
         onClick={close} className={(modal ? 'Sidebar-wrapper ' : '') + (!status ? `Sidebar-wrapper-close` : '')}
      >
         <div
            onClick={e => { e.stopPropagation() }}
            style={styles}
            className={(position ? `Sidebar Sidebar-${position}` : 'Sidebar') + ' ' + (!status ? `Sidebar-${position}-close` : '') + ' ' + wrapperClassName}
         >
            {children}
         </div>
      </div>
   )
}

/**
 * Sidar, smoothly leaving the right, left, top or bottom
 */
export default React.memo(Sidebar);

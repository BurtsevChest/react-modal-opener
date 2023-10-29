import React from "react";

/**
 * A wrapper above each modal window specifying the z-index
 */
const ZIndex: React.FC<{ id: number, children: React.ReactNode, startZindex: number }> = ({ id, children, startZindex }) => {
   return (
      <div id={`popup-${id}`} style={{
         zIndex: startZindex + ((id + 1) * 10),
         position: "relative",
      }}>
         {children}
      </div>
   )
}

export default ZIndex;

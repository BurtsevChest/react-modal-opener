import React from "react";

/**
 * A wrapper above each modal window specifying the z-index
 */
const ZIndex: React.FC<{ id: number, children: React.ReactNode }> = ({ id, children }) => {
   return (
      <div id={`popup-${id}`} style={{
         zIndex: (id + 1) * 10,
         position: "relative",
      }}>
         {children}
      </div>
   )
}

export default ZIndex;

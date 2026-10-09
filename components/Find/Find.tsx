import React from "react";
import Findbus from "./Findbus";
import FindByAddress from "./FindByAddress";
import FindBynumber from "./FindBynumber";

function Find() {
  return (
    <div id="find-bus" className="scroll-mt-28">
      <Findbus />
      <FindByAddress />
      <FindBynumber />
    </div>
  );
}

export default Find;
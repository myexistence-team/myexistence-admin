import React from "react";
import { CFooter } from "@coreui/react";
import moment from "moment";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        HADIR Admin WebApp
        <span className="ml-1">
          &copy; {moment().format("YYYY")}{" "}
        </span>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);

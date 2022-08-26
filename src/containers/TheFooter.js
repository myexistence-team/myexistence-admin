import React from "react";
import { CFooter } from "@coreui/react";
import moment from "moment";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        HADIR Web App
        <span className="ml-1">
          &copy; {moment().format("YYYY")}{" "}
        </span>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);

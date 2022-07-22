import React from "react";
import { CFooter } from "@coreui/react";
import moment from "moment";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        ME Admin WebApp
        <span className="ml-1">
          &copy; {moment().format("YYYY")}{" "}
          <a
            href="https://zone.binabangsaschool.com/binabangsa/"
            target="_blank"
          >
            ME
          </a>
          .
        </span>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);

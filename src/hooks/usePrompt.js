import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

export const usePrompt = (
  when,
  message = "Apakah anda yakin ingin meninggalkan halaman ini?"
) => {
  const history = useHistory();
  const self = useRef(null);

  const onWindowOrTabClose = event => {
    if (!when) {
      return;
    }

    if (typeof event === undefined) {
      event = window.event;
    }

    if (event) {
      event.returnValue = message;
    }

    return message;
  };

  useEffect(() => {
    if (when) {
      self.current = history.block(message);
    } else {
      self.current = null;
    }

    window.addEventListener("beforeunload", onWindowOrTabClose);

    return () => {
      if (self.current) {
        self.current();
        self.current = null;
      }

      window.removeEventListener("beforeunload", onWindowOrTabClose);
    };
  }, [message, when]);
};

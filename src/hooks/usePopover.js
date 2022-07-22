import { useEffect, useRef, useState } from "react";
import getCaretCoordinates from "textarea-caret";
import { MENTIONING_REGEX } from "../globals";

export function usePopover({
  data,
  value,
  setValue,
  delay,
  mdEditor,
  initialRef
}) {
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentQueryRange, setCurrentQueryRange] = useState({
    startingIndex: 0,
    endingIndex: 0
  });
  const [previousValue, setPreviousValue] = useState({
    letter: "",
    length: 0
  });

  const [showPopover, setShowPopover] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [caretIndex, setCaretIndex] = useState(0);
  const [caretPosition, setCaretPosition] = useState({});

  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const [autocompletingIndex, setAutocompletingIndex] = useState(0);

  const queryRef = useRef();
  const currentQueryRef = useRef(currentQuery);
  const editorEventRef = useRef();

  const isAutoCompletingRef = useRef(isAutoCompleting);
  const autocompletingIndexRef = useRef(autocompletingIndex);

  useEffect(() => {
    currentQueryRef.current = "";
    isAutoCompletingRef.current = false;
    autocompletingIndexRef.current = 0;
  }, []);

  useEffect(() => {
    if (value && initialRef && !initialRef.current) {
      if (editorEventRef.current && isAutoCompletingRef.current) {
        /** Issue with Markdown Editor that we have to wait for 5-10ms before executing the cursor change. */
        setTimeout(() => {
          editorEventRef.current.target.selectionEnd =
            autocompletingIndexRef.current;

          setIsAutoCompleting(false);
          isAutoCompletingRef.current = false;
        }, 5);
      } else {
        clearTimeout(queryRef.current);
        queryRef.current = setTimeout(() => {
          handleEditorSearch();
        }, delay || 150);
      }
    }
  }, [value]);

  useEffect(() => {
    if (initialRef && initialRef.current) {
      replaceInitialValueToMentionedUsers();
      initialRef.current = null;
    }
  }, [initialRef?.current]);

  function handleEditorSearch() {
    // 1. If editor value is null, reset everything
    if (value === "") {
      resetPopover();
    }

    const matchingResults = [];
    let match;
    do {
      match = MENTIONING_REGEX.exec(value);
      if (match) {
        const result = match[1].toString();
        const startingIndex = match.index + 1;
        const endingIndex = startingIndex + result.length;
        matchingResults.push({
          result,
          startingIndex,
          endingIndex
        });
      }
    } while (match);

    const previousLetter = value[previousValue.letter - 1];

    // 3. Show the Popover if the previous letter that was pressed was @
    if (!showPopover && previousLetter === "@") {
      setCurrentQuery("");
      setShowPopover(true);
    }

    // 4. Close the popover if conditions are true
    if (
      showPopover &&
      (previousLetter === " " || previousValue.letter === "@")
    ) {
      resetPopover();
    }

    // 5. Handle autocompletion & currentQuery
    for (let { result, startingIndex, endingIndex } of matchingResults) {
      if (
        caretIndex > startingIndex - 1 &&
        caretIndex < endingIndex + 1 &&
        !isAutoCompleting
      ) {
        setShowPopover(true);

        setCurrentQueryRange({
          startingIndex,
          endingIndex
        });
        setCurrentQuery(result);
        currentQueryRef.current = result;
      }
    }

    // 6. Cache the previous value.
    setPreviousValue({
      length: value.length,
      letter: value[caretIndex - 1]
    });
  }

  function handleEditorKeydown(event) {
    if (showPopover) {
      switch (event.keyCode) {
        case 13 /** Enter Key */:
          event.preventDefault();
          if (data.length === 0) break;
          handleAutocomplete();
          break;
        case 38 /** ArrowUp Key */:
          event.preventDefault();
          setSelectedIndex(index => (index > 0 ? index - 1 : 0));
          break;
        case 40 /** ArrowDown Key */:
          event.preventDefault();
          setSelectedIndex(index =>
            index < data.length - 1 ? index + 1 : data.length - 1
          );
          break;
        default:
          break;
      }
    }
  }

  function handleEditorBlur() {
    if (showPopover) {
      setTimeout(() => {
        setShowPopover(false);
      }, 250);
    }
  }

  function handlePopoverChange(event, callback) {
    if (event) {
      event.preventDefault();
      event.persist();
      editorEventRef.current = event;

      const { top, left, height } = getCaretCoordinates(
        event.target,
        event.target.selectionEnd
      );
      setCaretIndex(event.target.selectionStart);
      setCaretPosition({
        top: top + height + (mdEditor ? 40 : 5),
        left
      });
    }

    callback();
  }

  function handlePopoverSelect(index) {
    setSelectedIndex(index);
    handleAutocomplete(index);
  }

  function handleAutocomplete(index) {
    autocompleteData(data[index] || data[selectedIndex]);
    resetPopover();
  }

  function autocompleteData(selected) {
    const replacedValue = replaceAt(
      value,
      currentQueryRef.current,
      selected,
      currentQueryRange.startingIndex,
      value.length
    );

    setIsAutoCompleting(true);
    isAutoCompletingRef.current = true;

    const newCompletingIndex =
      currentQueryRange.startingIndex + selected.length;
    setAutocompletingIndex(newCompletingIndex);
    autocompletingIndexRef.current = newCompletingIndex;

    setValue(replacedValue);
  }

  function replaceAt(input, search, replace, start, end) {
    return (
      input.slice(0, start) +
      input.slice(start, end).replace(search, replace) +
      input.slice(end)
    );
  }

  function replaceInitialValueToMentionedUsers() {
    const substitutionPattern = /\[@\S*\]\(\S*\)/g;
    const mentionedUsersPattern = /\[@\S*\]/g;
    const links = value.match(substitutionPattern) || [];
    if (links.length > 0) {
      let transformedBody = value;

      const transformedUsers =
        links
          .join(" ")
          .match(mentionedUsersPattern)
          .map(user => user.replace(/\[|\]/g, "")) || [];

      transformedUsers.forEach((user, index) => {
        transformedBody = transformedBody.replace(links[index], user);
      });

      setValue(transformedBody);
      setShowPopover(false);
    }
  }

  function resetPopover() {
    setCurrentQuery("");
    currentQueryRef.current = "";

    setShowPopover(false);
    setSelectedIndex(0);
  }

  return {
    currentQuery,
    showPopover,
    setShowPopover,
    caretPosition,
    handleEditorKeydown,
    handleEditorBlur,
    handlePopoverChange,
    handlePopoverSelect,
    selectedIndex
  };
}

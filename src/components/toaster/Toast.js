import React, {
  memo,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import { css } from "glamor";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";
import { CAlert } from "@coreui/react";

const animationEasing = {
  deceleration: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  acceleration: "cubic-bezier(0.4, 0.0, 1, 1)",
  spring: "cubic-bezier(0.175, 0.885, 0.320, 1.175)"
};

const ANIMATION_DURATION = 240;

const openAnimation = css.keyframes("openAnimation", {
  from: {
    opacity: 0,
    transform: "translateY(-120%)"
  },
  to: {
    transform: "translateY(0)"
  }
});

const closeAnimation = css.keyframes("closeAnimation", {
  from: {
    transform: "scale(1)",
    opacity: 1
  },
  to: {
    transform: "scale(0.9)",
    opacity: 0
  }
});

const animationStyles = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: 0,
  transition: `all ${ANIMATION_DURATION}ms ${animationEasing.deceleration}`,
  '&[data-state="entering"], &[data-state="entered"]': {
    animation: `${openAnimation} ${ANIMATION_DURATION}ms ${animationEasing.spring} both`
  },
  '&[data-state="exiting"]': {
    animation: `${closeAnimation} 120ms ${animationEasing.acceleration} both`
  }
});

const Toast = memo(function Toast(props) {
  const {
    children,
    duration,
    hasCloseButton,
    // Template props
    color,
    isShown: isShownProp,
    onRemove,
    title,
    zIndex
  } = props;

  const transitionRef = useRef(null);
  const [isShown, setIsShown] = useState(true);
  const [height, setHeight] = useState(0);
  const closeTimer = useRef(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearCloseTimer();
    setIsShown(false);
  }, [clearCloseTimer]);

  const startCloseTimer = useCallback(() => {
    if (duration) {
      clearCloseTimer();
      closeTimer.current = setTimeout(() => {
        close();
      }, duration * 1000);
    }
  }, [duration, clearCloseTimer, close]);

  useEffect(() => {
    startCloseTimer();

    return () => {
      clearCloseTimer();
    };
  }, [startCloseTimer, clearCloseTimer]);

  useEffect(() => {
    if (isShownProp !== isShown && typeof isShownProp === "boolean") {
      setIsShown(isShownProp);
    }
  }, [isShown, isShownProp]);

  const handleMouseEnter = useCallback(() => clearCloseTimer(), [
    clearCloseTimer
  ]);
  const handleMouseLeave = useCallback(() => startCloseTimer(), [
    startCloseTimer
  ]);

  const onRef = useCallback(ref => {
    if (ref === null) return;

    const { height: rectHeight } = ref.getBoundingClientRect();
    setHeight(rectHeight);
  }, []);

  const styles = useMemo(
    () => ({
      height,
      zIndex,
      padding: 8,
      marginBottom: isShown ? 0 : -height
    }),
    [isShown, height, zIndex]
  );

  const [coreUiShow, setCoreUiShow] = useState(true);

  // This is because CoreUI's toaster only has onShowChange, rather
  // than seperate onShow and onHide kind of props
  function handleCoreUiShow() {
    if (!coreUiShow) {
      props.onRemove();
    }
    setCoreUiShow(!coreUiShow);
  }

  return (
    <Transition
      nodeRef={transitionRef}
      appear
      unmountOnExit
      timeout={ANIMATION_DURATION}
      in={isShown}
      onExited={onRemove}
    >
      {state => (
        <div
          ref={transitionRef}
          data-state={state}
          className={animationStyles}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={styles}
        >
          <div ref={onRef}>
            <CAlert
              color={color}
              closeButton={hasCloseButton}
              onShowChange={handleCoreUiShow}
              style={{
                flexShrink: 0
              }}
            >
              {title}
            </CAlert>
          </div>
        </div>
      )}
    </Transition>
  );
});

Toast.propTypes = {
  /**
   * Duration of the toast.
   */
  duration: PropTypes.number,

  /**
   * Function called when the toast is all the way closed.
   */
  onRemove: PropTypes.func,

  /**
   * The type of the alert.
   */
  color: PropTypes.oneOf(["info", "success", "warning", "danger"]),

  /**
   * The title of the alert.
   */
  title: PropTypes.node,

  /**
   * Description of the alert.
   */
  children: PropTypes.node,

  /**
   * When true, show a close icon button inside of the toast.
   */
  hasCloseButton: PropTypes.bool,

  /**
   * When false, will close the Toast and call onRemove when finished.
   */
  isShown: PropTypes.bool
};

export default Toast;

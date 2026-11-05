import {
  cloneElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { themeStyles, useTheme } from "../Theme";
import { TooltipPosition } from "./TooltipPosition";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
  children: ReactElement<{ "aria-describedby"?: string }>;
  content: ReactNode;
  position?: TooltipPosition;
}

const GAP = 10;
const VIEWPORT_PADDING = 8;

export function Tooltip({ children, content, position = TooltipPosition.Top }: TooltipProps) {
  const theme = useTheme();
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });
  const open = (hovered || focused) && !dismissed;
  const portalRoot = document.getElementById("tooltip-root");

  useLayoutEffect(() => {
    if (!open || !portalRoot) return;

    function updatePosition() {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;

      const anchor = trigger.getBoundingClientRect();
      const box = tooltip.getBoundingClientRect();
      let top = anchor.top + (anchor.height - box.height) / 2;
      let left = anchor.left + (anchor.width - box.width) / 2;

      switch (position) {
        case TooltipPosition.Top:
          top = anchor.top - box.height - GAP;
          break;
        case TooltipPosition.Bottom:
          top = anchor.bottom + GAP;
          break;
        case TooltipPosition.Left:
          left = anchor.left - box.width - GAP;
          break;
        case TooltipPosition.Right:
          left = anchor.right + GAP;
          break;
      }

      setCoordinates({
        top: Math.max(
          VIEWPORT_PADDING,
          Math.min(top, window.innerHeight - box.height - VIEWPORT_PADDING),
        ),
        left: Math.max(
          VIEWPORT_PADDING,
          Math.min(left, window.innerWidth - box.width - VIEWPORT_PADDING),
        ),
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePosition);
    if (triggerRef.current) observer?.observe(triggerRef.current);
    if (tooltipRef.current) observer?.observe(tooltipRef.current);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      observer?.disconnect();
    };
  }, [open, position, content, portalRoot]);

  const describedBy =
    [children.props["aria-describedby"], open && portalRoot ? id : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <span
      className={styles.trigger}
      ref={triggerRef}
      onMouseEnter={() => {
        setHovered(true);
        setDismissed(false);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        setFocused(true);
        setDismissed(false);
      }}
      onBlur={() => setFocused(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setDismissed(true);
      }}
    >
      {cloneElement(children, { "aria-describedby": describedBy })}
      {open &&
        portalRoot &&
        createPortal(
          <div
            id={id}
            ref={tooltipRef}
            role="tooltip"
            className={`${styles.tooltip} ${themeStyles[theme]}`}
            data-theme={theme}
            data-position={position}
            style={coordinates}
            onClick={(event) => event.stopPropagation()}
          >
            {content}
          </div>,
          portalRoot,
        )}
    </span>
  );
}

import { RefObject, useEffect } from "react";

/**
 * 点击外部关闭的通用 Hook
 * @param ref 要监听的元素引用
 * @param callback 点击外部时执行的回调函数
 * @param isActive 是否激活监听（可选，默认为 true）
 */
export const useClickOutSide = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  isActive: boolean
) => {
  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutSide);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [ref, callback, isActive]);
};

import { useRef } from 'react';

// ref: https://thoughtspile.github.io/2021/11/30/lazy-useref/

// none is a special value used to detect an uninitialized ref
const NONE = {};
export default function useLazyRef(init) {
  // not initialized yet
  const ref = useRef(NONE);
  // if it's not initialized (1st render)
  if (ref.current === NONE) {
    // we initialize it
    ref.current = init();
  }
  // new we return the initialized ref
  return ref;
}

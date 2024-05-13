/**
 * 計算字串長度，非英文算 2 個字元
 */
export const countAsciiCharLength = str => {
  return str.split('').reduce((acc, c) => {
    return acc + (c.charCodeAt(0) > 127 ? 2 : 1);
  }, 0);
};

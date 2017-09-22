let result;

export default function is2017NewDesign() {
  if (typeof result === 'undefined') {
    result = document.getElementsByTagName('ytd-app').length > 0;
  }
  return result;
}

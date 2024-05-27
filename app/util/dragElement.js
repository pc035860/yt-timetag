/* eslint no-param-reassign: 0 */

export default function dragElement(
  elm,
  { draggableClass = 'draggable' } = {}
) {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;

  // delegate mousedown event to the elm, select with draggableClass
  elm.addEventListener(
    'mousedown',
    (e) => {
      if (
        e.target.classList.contains(draggableClass) ||
        e.target.closest(`.${draggableClass}`)
      ) {
        dragMouseDown(e);
      }
    },
    false
  );

  function dragMouseDown(e) {
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.addEventListener('mouseup', closeDragElement, true);
    // call a function whenever the cursor moves:
    document.addEventListener('mousemove', elementDrag, true);
  }

  function elementDrag(e) {
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // set the element's new position:
    elm.style.left = `${elm.offsetLeft - pos1}px`;
    elm.style.top = `${elm.offsetTop - pos2}px`;
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.removeEventListener('mouseup', closeDragElement, true);
    document.removeEventListener('mousemove', elementDrag, true);
  }
}

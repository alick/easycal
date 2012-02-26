// Code originally from:
// https://addons.mozilla.org/en-US/developers/docs/sdk/1.4/dev-guide/addon-development/annotator/widget.html
this.addEventListener('click', function(event) {
  if(event.button == 0 && event.shiftKey == false)
    self.port.emit('left-click');

  if(event.button == 2 || (event.button == 0 && event.shiftKey == true))
    self.port.emit('right-click');
    event.preventDefault();
}, true);

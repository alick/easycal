const widgets = require("widget");
const tabs = require("tabs");
data = require("self").data;

var widget = widgets.Widget({
  id: "easycal-link",
  label: "EasyCal project homepage",
  contentURL: data.url("huaci-small.png"),
  onClick: function() {
    tabs.open("http://code.google.com/p/easycal/");
  }
});

console.log("The add-on is running.");

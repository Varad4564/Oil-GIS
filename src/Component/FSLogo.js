import 'leaflet.fullscreen'; 

L.Control.FullScreen = L.Control.FullScreen.extend({
  onAdd: function(map) {
    // Create a container for the fullscreen button
    var container = L.DomUtil.create('div', 'leaflet-control-fullscreen-button');
    container.title = 'Toggle Fullscreen';

    // Create an icon/image element for the logo
    var logoImg = L.DomUtil.create('img', 'logo-icon', container);
    logoImg.src = './fullScreen.png';
    logoImg.alt = 'Logo';

    // Create a text element for the button label
    var label = L.DomUtil.create('span', 'button-label', container);
    label.textContent = 'Fullscreen';

    // Add click event listener to toggle fullscreen mode
    L.DomEvent.on(container, 'click', function() {
      map.toggleFullscreen();
    });

    return container;
  },
});
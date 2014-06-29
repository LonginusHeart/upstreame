require.config({
  baseUrl: 'scripts',
  packages: [{
    location: '/domkit/domkit',
    name: 'domkit',
    main: 'domkit'
  }],
  paths: {
    jquery: '/jquery/jquery.min',
    underscore: '/underscore-amd/underscore-min'
  }
});


require(
    ['jquery', 'underscore', 'domkit/controllers/radiogroup',
     'domkit/ui/button', 'domkit/ui/palette'],
    function ($, _, RadioGroup, Button, Palette) {

  // initializeButtons initializes all domkit buttons and returns button
  // instances in an object with buttons namespaced to location in the view.
  function initializeButtons() {
    var buttons = Object.create(null);

    buttons.toolbar = Object.create(null);
    buttons.toolbar.activeColor = Button.create('#active-color-button');
    buttons.toolbar.defaultColor = Button.create('#default-color-button');
    buttons.toolbar.toolSelect = Button.create('#tool-select-button');
    buttons.toolbar.undo = Button.create('#undo-button');
    buttons.toolbar.redo = Button.create('#redo-button');
    buttons.toolbar.zoom = Button.create('#zoom-button');
    buttons.toolbar.trash = Button.create('#trash-button');
    buttons.toolbar.load = Button.create('#load-button');
    buttons.toolbar.save = Button.create('#save-button');
    buttons.toolbar.settings = Button.create('#settings-button');
    buttons.toolbar.session = Button.create('#session-button');

    buttons.toolSelectMenu = Object.create(null);
    buttons.toolSelectMenu.paintBrush =
        Button.create('#select-paint-brush-button');
    buttons.toolSelectMenu.dropper = Button.create('#select-dropper-button');
    buttons.toolSelectMenu.paintBucket =
        Button.create('#select-paint-bucket-button');
    buttons.toolSelectMenu.eraser = Button.create('#select-eraser-button');

    return buttons;
  }


  // onload -- main
  $(function () {
    var buttons = initializeButtons();
    var toolbarRadioGroup = new RadioGroup(_.values(_.omit(
        buttons.toolbar, ['undo', 'redo'])));

    var toolSelectButtons = [
      buttons.toolSelectMenu.paintBrush, buttons.toolSelectMenu.dropper,
      buttons.toolSelectMenu.paintBucket, buttons.toolSelectMenu.eraser,
    ];
    var toolSelectRadioGroup = new RadioGroup(
      toolSelectButtons, 0 /* activeIndex */);

    var toolSelectPalette = new Palette({
      anchorEdge: Palette.ANCHOR_EDGES.RIGHT,
      anchorEdgeBounds: { min: 0, max: $(window).height() },
      menu: '#tool-select-menu',
      sibling: '#tool-select-button'
    });
    buttons.toolbar.toolSelect.addStateHandler(function (state) {
      toolSelectPalette.visible(state);
    });

    $(document).bind('keydown', function (e) {
      // If the escape key was pressed clear toolbar selection.
      if (e.which === 27) {
        toolbarRadioGroup.clear();
      }
    });
  });
});

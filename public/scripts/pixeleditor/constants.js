define(
    ['pixeleditor/controller/gridmodelbuilder'],
    function (GridModelBuilder) {
  // Centralized access points to constants in the pixel editor applications.
  var Constants = Object.create(null);

  Constants.AVAILABLE_TOOLS = {
    PAINTBRUSH: 'paintbrush-tool',
    DROPPER: 'dropper-tool',
    PAINTBUCKET: 'paintbucket-tool',
    ERASER: 'eraser-tool',
    ZOOM_IN: 'zoom-in-tool',
    ZOOM_OUT: 'zoom-out-tool',
    SHIFTER: 'shifter-tool'
  };

  Constants.COLOR_PALETTE_SIZE = 12;

  Constants.STARTING_VALUES = {
    ACTIVE_COLOR: '#000000',
    DEFAULT_COLOR: '#FFFFFF',
    DEFAULT_TOOL: Constants.AVAILABLE_TOOLS.PAINTBRUSH,
    CANVAS_DIMENSIONS: { width: 16, height: 16 },
    GRID_VISIBLE: true
  };

  Constants.TOOL_ICON_CLASSES = Object.create(null);
  Constants.TOOL_ICON_CLASSES[Constants.AVAILABLE_TOOLS.PAINTBRUSH] =
      'icon-paint-brush';
  Constants.TOOL_ICON_CLASSES[Constants.AVAILABLE_TOOLS.DROPPER] =
      'icon-dropper';
  Constants.TOOL_ICON_CLASSES[Constants.AVAILABLE_TOOLS.PAINTBUCKET] =
      'icon-paint-bucket';
  Constants.TOOL_ICON_CLASSES[Constants.AVAILABLE_TOOLS.ERASER] =
      'icon-eraser';
  Constants.TOOL_ICON_CLASSES[Constants.AVAILABLE_TOOLS.ZOOM_IN] =
      'icon-zoom-in';
  Constants.TOOL_ICON_CLASSES[Constants.AVAILABLE_TOOLS.ZOOM_OUT] =
      'icon-zoom-out';
  Constants.TOOL_ICON_CLASSES[Constants.AVAILABLE_TOOLS.SHIFTER] = '';

  Constants.TOOL_TO_ACTION_MAP = Object.create(null);
  Constants.TOOL_TO_ACTION_MAP[Constants.AVAILABLE_TOOLS.PAINTBRUSH] =
      GridModelBuilder.CONTROLLER_ACTIONS.SET;
  Constants.TOOL_TO_ACTION_MAP[Constants.AVAILABLE_TOOLS.DROPPER] =
      GridModelBuilder.CONTROLLER_ACTIONS.GET;
  Constants.TOOL_TO_ACTION_MAP[Constants.AVAILABLE_TOOLS.PAINTBUCKET] =
      GridModelBuilder.CONTROLLER_ACTIONS.FILL;
  Constants.TOOL_TO_ACTION_MAP[Constants.AVAILABLE_TOOLS.ERASER] =
      GridModelBuilder.CONTROLLER_ACTIONS.CLEAR;
  Constants.TOOL_TO_ACTION_MAP[Constants.AVAILABLE_TOOLS.ZOOM_IN] =
      GridModelBuilder.CONTROLLER_ACTIONS.NONE;
  Constants.TOOL_TO_ACTION_MAP[Constants.AVAILABLE_TOOLS.ZOOM_OUT] =
      GridModelBuilder.CONTROLLER_ACTIONS.NONE;
  Constants.TOOL_TO_ACTION_MAP[Constants.AVAILABLE_TOOLS.SHIFTER] =
      GridModelBuilder.CONTROLLER_ACTIONS.SHIFT;

  Constants.TOOL_TYPES = {
    SINGLE_PIXEL: 'single-pixel',
    SELECTION: 'selection',
    DRAG: 'drag',
    CANVAS_CLICK: 'canvas-click'
  };

  Constants.TOOL_TO_TYPE_MAP = Object.create(null);
  Constants.TOOL_TO_TYPE_MAP[Constants.AVAILABLE_TOOLS.PAINTBRUSH] =
      Constants.TOOL_TYPES.SINGLE_PIXEL;
  Constants.TOOL_TO_TYPE_MAP[Constants.AVAILABLE_TOOLS.DROPPER] =
      Constants.TOOL_TYPES.SINGLE_PIXEL;
  Constants.TOOL_TO_TYPE_MAP[Constants.AVAILABLE_TOOLS.PAINTBUCKET] =
      Constants.TOOL_TYPES.SINGLE_PIXEL;
  Constants.TOOL_TO_TYPE_MAP[Constants.AVAILABLE_TOOLS.ERASER] =
      Constants.TOOL_TYPES.SINGLE_PIXEL;
  Constants.TOOL_TO_TYPE_MAP[Constants.AVAILABLE_TOOLS.ZOOM_IN] =
      Constants.TOOL_TYPES.SELECTION;
  Constants.TOOL_TO_TYPE_MAP[Constants.AVAILABLE_TOOLS.ZOOM_OUT] =
      Constants.TOOL_TYPES.CANVAS_CLICK;
  Constants.TOOL_TO_TYPE_MAP[Constants.AVAILABLE_TOOLS.SHIFTER] =
      Constants.TOOL_TYPES.DRAG;

  Constants.KEYS = {
    ENTER: 13,
    ESCAPE: 27
  };

  return Constants;
});

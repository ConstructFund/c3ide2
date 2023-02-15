const SDK = self.SDK;

const PLUGIN_INFO = {
  "id": "skymen_Shell",
  "version": "1.0.0.2",
  "category": "general",
  "author": "skymen",
  "type": "world",
  "addonType": "plugin",
  "info": {
    "Set": {
      "IsResizable": true,
      "IsRotatable": true,
      "Is3D": false,
      "HasImage": false,
      "DefaultImageURL": null,
      "IsTiled": false,
      "IsDeprecated": false,
      "IsSingleGlobal": false,
      "SupportsZElevation": true,
      "SupportsColor": true,
      "SupportsEffects": true,
      "MustPreDraw": true,
      "CanBeBundled": true
    },
    "AddCommonACEs": {
      "Position": true,
      "SceneGraph": true,
      "Size": true,
      "Angle": true,
      "Appearance": true,
      "ZOrder": true
    }
  },
  "properties": [
    {
      "type": "float",
      "id": "hotspot-x",
      "value": 0.5,
      "options": {
        "interpolatable": false
      },
      "name": "Origin X",
      "desc": "X Coordinate (0-1)"
    },
    {
      "type": "float",
      "id": "hotspot-y",
      "value": 0.5,
      "options": {
        "interpolatable": false
      },
      "name": "Origin Y",
      "desc": "Y Coordinate (0-1)"
    }
  ]
}

let app = null;

SDK.Plugins[PLUGIN_INFO.id] = class extends SDK.IPluginBase {
  constructor() {
    super(PLUGIN_INFO.id);
    SDK.Lang.PushContext("plugins." + PLUGIN_INFO.id.toLowerCase());
    this._info.SetName(self.lang(".name"));
    this._info.SetDescription(self.lang(".description"));
    this._info.SetVersion(PLUGIN_INFO.version);
    this._info.SetCategory(PLUGIN_INFO.category);
    this._info.SetAuthor(PLUGIN_INFO.author);
    this._info.SetPluginType(PLUGIN_INFO.type);
    this._info.SetHelpUrl(self.lang(".help-url"));
    if (PLUGIN_INFO.info && PLUGIN_INFO.info.Set)
      Object.keys(PLUGIN_INFO.info.Set).forEach((key) => {
        const value = PLUGIN_INFO.info.Set[key];
        const fn = this._info[`Set${key}`];
        if (fn && value !== null && value !== undefined)
          fn.call(this._info, value);
      });
    if (PLUGIN_INFO.info && PLUGIN_INFO.info.AddCommonACEs)
      Object.keys(PLUGIN_INFO.info.AddCommonACEs).forEach((key) => {
        if (PLUGIN_INFO.info.AddCommonACEs[key])
          this._info[`AddCommon${key}ACEs`]();
      });
    SDK.Lang.PushContext(".properties");
    this._info.SetProperties(
      (PLUGIN_INFO.properties || []).map(
        (prop) =>
          new SDK.PluginProperty(prop.type, prop.id, prop.value, prop.options)
      )
    );
    SDK.Lang.PopContext(); // .properties
    SDK.Lang.PopContext();
  }
};
const P_C = SDK.Plugins[PLUGIN_INFO.id];
P_C.Register(PLUGIN_INFO.id, P_C);

P_C.Type = class extends SDK.ITypeBase {
  constructor(sdkPlugin, iObjectType) {
    super(sdkPlugin, iObjectType);
  }
};

P_C.Instance = class extends SDK.IWorldInstanceBase {
  constructor(sdkType, inst) {
    super(sdkType, inst);
  }

  Release() {}

  OnCreate() {
    this.UpdateOrigin();
  }

  OnPlacedInLayout() {}

  Draw(iRenderer, iDrawParams) {
    // draw a box with line width 4
    iRenderer.SetColorFillMode();
    iRenderer.PushLineWidth(4);
    iRenderer.PushLineCap("square");
    iRenderer.SetColor(this._inst.GetColor());
    iRenderer.LineQuad(this._inst.GetQuad());
    iRenderer.PopLineWidth();
    iRenderer.PopLineCap();
  }

  IsOriginalSizeKnown() {
    return false;
  }

  HasDoubleTapHandler() {
    return false;
  }

  OnDoubleTap() {}

  UpdateOrigin() {
    this._inst.SetOrigin(
      this._inst.GetPropertyValue("hotspot-x"),
      this._inst.GetPropertyValue("hotspot-y")
    );
  }

  OnPropertyChanged(id, value) {
    // handle hotspot-x and hotspot-y properties
    if (id === "hotspot-x" || id === "hotspot-y") {
      this.UpdateOrigin();
    }
  }

  LoadC2Property(name, valueString) {
    return false; // not handled
  }
};

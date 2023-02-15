const C3 = self.C3;

const PLUGIN_INFO = {
  id: "skymen_Shell",
  Acts: {
    "SetSource": {
          "forward": (inst) => inst._SetSource,
          
          "autoScriptInterface": false,
          },
"SetHotspot": {
          "forward": (inst) => inst._SetOrigin,
          
          "autoScriptInterface": true,
          }
  },
  Cnds: {
    "HasSource": {
          
          "handler": function() {
        return !!(this.source || this.sourceTex);
      },
          "autoScriptInterface": true,
        },
"KeepsSync": {
          
          "handler": function () {
        return !!(this.source || this.sourceTex) && this.keepSync;
      },
          "autoScriptInterface": true,
        }
  },
  Exps: {
    "HotspotX": {
          
          "handler": function() {
        return this.hotspotX;
      },
          "autoScriptInterface": true,
        },
"HotspotY": {
          
          "handler": function() {
        return this.hotspotY;
      },
          "autoScriptInterface": true,
        }
  },
};

C3.Plugins[PLUGIN_INFO.id] = class extends C3.SDKPluginBase {
  constructor(opts) {
    super(opts);
  }

  Release() {
    super.Release();
  }
};
const P_C = C3.Plugins[PLUGIN_INFO.id];
P_C.Type = class extends C3.SDKTypeBase {
  constructor(objectClass) {
    super(objectClass);
  }

  Release() {
    super.Release();
  }

  OnCreate() {}
};

//====== SCRIPT INTERFACE ======
const map = new WeakMap();

function getScriptInterface(parentClass, map) {
  return class extends parentClass {
    constructor() {
      super();
      map.set(this, self.IInstance._GetInitInst().GetSdkInstance());
      this.SYNC_SIZE = {
        NO_SYNC: 0,
        SPRITE_SIZE: 1,
        IMAGE_SIZE: 2,
      };
      this.FALLBACK = {
        DESTROY: 0,
        FALLBACK_OR_DESTROY: 1,
        FALLBACK_OR_RESET: 2,
        RESET: 3,
      };
    }

    SetSource(objectClass, keepSync, syncSize, fallback, syncOrigin) {
      const sdkInst = map.get(this);
      const sdkObjectClass = sdkInst._runtime._objectClassesByName.get(
        objectClass.name.toLowerCase()
      );
      sdkInst._SetSource(
        sdkObjectClass,
        keepSync,
        syncSize,
        fallback,
        syncOrigin
      );
    }
  };
}


const scriptInterface = getScriptInterface(self.IWorldInstance, map);

// extend script interface with plugin actions
Object.keys(PLUGIN_INFO.Acts).forEach((key) => {
  const ace = PLUGIN_INFO.Acts[key];
  if (!ace.autoScriptInterface) return;
  scriptInterface.prototype[key] = function (...args) {
    const sdkInst = map.get(this);
    P_C.Acts[key].call(sdkInst, ...args);
  };
});

// extend script interface with plugin conditions
Object.keys(PLUGIN_INFO.Cnds).forEach((key) => {
  const ace = PLUGIN_INFO.Cnds[key];
  if (!ace.autoScriptInterface) return;
  scriptInterface.prototype[key] = function (...args) {
    const sdkInst = map.get(this);
    return P_C.Cnds[key].call(sdkInst, ...args);
  };
});

// extend script interface with plugin expressions
Object.keys(PLUGIN_INFO.Exps).forEach((key) => {
  const ace = PLUGIN_INFO.Exps[key];
  if (!ace.autoScriptInterface) return;
  scriptInterface.prototype[key] = function (...args) {
    const sdkInst = map.get(this);
    return P_C.Exps[key].call(sdkInst, ...args);
  };
});
//====== SCRIPT INTERFACE ======

//============ ACES ============
P_C.Acts = {};
P_C.Cnds = {};
P_C.Exps = {};
Object.keys(PLUGIN_INFO.Acts).forEach((key) => {
  const ace = PLUGIN_INFO.Acts[key];
  P_C.Acts[key] = function (...args) {
    if (ace.forward) ace.forward(this).call(this, ...args);
    else if (ace.handler) ace.handler.call(this, ...args);
  };
});
Object.keys(PLUGIN_INFO.Cnds).forEach((key) => {
  const ace = PLUGIN_INFO.Cnds[key];
  P_C.Cnds[key] = function (...args) {
    if (ace.forward) return ace.forward(this).call(this, ...args);
    if (ace.handler) return ace.handler.call(this, ...args);
  };
});
Object.keys(PLUGIN_INFO.Exps).forEach((key) => {
  const ace = PLUGIN_INFO.Exps[key];
  P_C.Exps[key] = function (...args) {
    if (ace.forward) return ace.forward(this).call(this, ...args);
    if (ace.handler) return ace.handler.call(this, ...args);
  };
});
//============ ACES ============

function getInstanceJs() {
  return class extends C3.SDKWorldInstanceBase {
    constructor(inst, properties) {
      super(inst);

      this.hotspotX = 0.5;
      this.hotspotY = 0.5;

      if (properties) {
        this.hotspotX = properties[0];
        this.hotspotY = properties[1];
      }

      this.source = null;
      this.sourceTex = null;
      this.sourceObject = null;
      this.keepSync = false;
      this.syncSize = 0;
      this.fallback = 3;
      this.syncOrigin = false;
      this.rcTex = C3.New(C3.Rect);

      this._SetOrigin(this.hotspotX, this.hotspotY);
    }

    _SetOrigin(x, y) {
      const wi = this.GetWorldInfo();
      wi.SetOriginX(x);
      wi.SetOriginY(y);
      this.hotspotX = x;
      this.hotspotY = y;
      wi.SetBboxChanged();
    }

    _SetSource(object, keepSync, syncSize, fallback, syncOrigin) {
      const inst = object.GetPairedInstance(this.GetInstance());
      if (!inst) return false;

      const sdkInst = inst.GetSdkInstance();
      if (!sdkInst) return false;

      if (
        !C3.Plugins.Sprite ||
        !(sdkInst instanceof C3.Plugins.Sprite.Instance)
      )
        return;

      this.source = null;
      this.sourceTex = null;
      this.sourceObject = object;
      this.keepSync = keepSync;
      this.syncSize = syncSize;
      this.fallback = fallback;
      this.syncOrigin = syncOrigin;

      if (this.keepSync) {
        this.source = sdkInst;
        this._StartTicking();
      } else {
        this.sourceTex = sdkInst.GetTexture();
        this.rcTex.copy(sdkInst.GetTexRect());
        this._StopTicking();
      }

      const wi = this.GetWorldInfo();
      const sourceWi = sdkInst.GetWorldInfo();
      const sourceImageInfo = sdkInst.GetCurrentImageInfo();

      if (this.syncSize === 1) {
        // sync size to source
        wi.SetSize(sourceWi.GetWidth(), sourceWi.GetHeight());
      } else if (this.syncSize === 2) {
        // sync size to source image
        wi.SetSize(sourceImageInfo.GetWidth(), sourceImageInfo.GetHeight());
      }

      if (this.syncOrigin) {
        this._SetOrigin(sourceWi.GetOriginX(), sourceWi.GetOriginY());
      }

      if (this.syncSize > 0) {
        wi.SetBboxChanged();
      }

      return true;
    }

    Release() {
      super.Release();
    }

    _TryFallBack() {
      return this._SetSource(
        this.sourceObject,
        this.keepSync,
        this.syncSize,
        this.fallback,
        this.syncOrigin
      );
    }

    _ResetImage() {
      this.source = null;
      this.sourceTex = null;
      this.sourceObject = null;
      this._StopTicking();
    }

    _Destroy() {
      this._StopTicking();
      this._runtime.DestroyInstance(this);
    }

    Tick() {
      if (this.source === null) {
        this._StopTicking();
        return;
      }

      if (!this.source._inst) {
        if (this.fallback === 0) {
          // destroy with source
          this._Destroy();
          return;
        } else if (this.fallback === 1) {
          // fallback or destroy
          if (!this._TryFallBack()) {
            this._Destroy();
            return;
          }
        } else if (this.fallback === 2) {
          // fallback or reset
          if (!this._TryFallBack()) {
            this._ResetImage();
            return;
          }
        } else if (this.fallback === 3) {
          // reset
          this._ResetImage();
          return;
        }
      }

      if (this.keepSync) {
        const sourceWi = this.source.GetWorldInfo();
        const wi = this.GetWorldInfo();
        const sourceImageInfo = this.source.GetCurrentImageInfo();

        if (this.syncSize === 1) {
          // sync size to source
          wi.SetSize(sourceWi.GetWidth(), sourceWi.GetHeight());
        } else if (this.syncSize === 2) {
          // sync size to source image
          wi.SetSize(sourceImageInfo.GetWidth(), sourceImageInfo.GetHeight());
        }

        if (this.syncOrigin) {
          this._SetOrigin(sourceWi.GetOriginX(), sourceWi.GetOriginY());
        }

        if (this.syncSize > 0) {
          wi.SetBboxChanged();
        }
      }
    }

    Draw(renderer) {
      const texture =
        this.sourceTex || (this.source && this.source.GetTexture());

      if (!texture) return; // dynamic texture load which hasn't completed yet; can't draw anything

      const wi = this.GetWorldInfo();
      const quad = wi.GetBoundingQuad();
      const rcTex = this.source
        ? this.source.GetCurrentImageInfo().GetTexRect()
        : this.rcTex;

      renderer.SetTexture(texture);

      if (this._runtime.IsPixelRoundingEnabled()) {
        const ox = Math.round(wi.GetX()) - wi.GetX();
        const oy = Math.round(wi.GetY()) - wi.GetY();
        tempQuad.copy(quad);
        tempQuad.offset(ox, oy);
        renderer.Quad3(tempQuad, rcTex);
      } else {
        renderer.Quad3(quad, rcTex);
      }
    }

    SaveToJson() {
      return {
        // data to be saved for savegames
      };
    }

    LoadFromJson(o) {
      // load state for savegames
    }

    GetScriptInterfaceClass() {
      return scriptInterface;
    }
  };
}


P_C.Instance = getInstanceJs();

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

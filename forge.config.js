module.exports = {
  packagerConfig: {
    icon:"./build/icon",
  },
  rebuildConfig: {},
  
  makers: [
    {
      name: '@electron-forge/maker-zip',
      
    },
    /*
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    */
  ],
};

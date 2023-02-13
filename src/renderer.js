async function  openFolder()  {
    console.log("open folder")
    
    const folder = await ipcRenderer.invoke('dialog:openDirectory');
    if (folder) {
      document.getElementById('selected-folder').innerText = folder;
      document.getElementById('boxed').style.display = "inline-block"
    }
  }
  let allFeatures = {};
  let fileTypes = {};
  let dirName;
  function checkDirName(isChecked){
    dirName = document.getElementById("dirName").value;
    if (isChecked) {
      if(!dirName){
        alertError("Type Directory Name!")
        return -1
      }
      if(dirName.length>20){
        alertError("Directory name is too long!")
        return -1
      }
      allFeatures["isChecked"] = true
    }
    else{

      allFeatures["isChecked"] = false
    }
    console.log(allFeatures)
  }

  function sortFiles() {
    const folder = document.getElementById('selected-folder').innerText
    if(!folder){
      alertError("Please open a directory first!");
      return;
    }
    if(fileTypes ===null)
      fileTypes = {};
    const isChecked = document.getElementById("largecheckbox").checked || false;
    if(checkDirName(isChecked) === -1) return;
    try {
      fs.readdirSync(folder).forEach(file => {
        
        if (!fs.isDirectory(`${folder}/${file}`)) {
          let fileExtension = file.split('.')[1]
          if (['lnk', 'exe', 'ink'].includes(fileExtension)) {
            return
          }
          if (['mp4', 'mkv', 'flv', 'avi', 'mpg'].includes(fileExtension)) {
            fileExtension = 'Videos'
          }
          if (['jpg', 'png'].includes(fileExtension)) {
            fileExtension = 'Photos'
          }
          if (!(fileExtension in fileTypes)) {
            fileTypes[fileExtension] = []
          }
          fileTypes[fileExtension].push(file)
        }

      })
      
      Object.keys(fileTypes).forEach(fileType => {
        let newFolder;
        if(allFeatures["isChecked"]){
          console.log("giriyor")
        newFolder = `${folder}/${dirName}`
        if (!fs.existsSync(newFolder)) {
          fs.mkdirSync(newFolder)
        }
        newFolder = `${folder}/${dirName}/${fileType}`
        if (!fs.existsSync(newFolder)) {
          fs.mkdirSync(newFolder)
        }
        }
        else {
          newFolder = `${folder}/${fileType}`
          if (!fs.existsSync(newFolder)) {
            fs.mkdirSync(newFolder)
        }
        }
      fileTypes[fileType].forEach(file => {
        fs.renameSync(`${folder}/${file}`, `${newFolder}/${file}`)
      })
    })
    document.getElementById("dirName").value = ""
    alertSuccess("Operation Succesful.")
  } catch (err) {
    console.error(err)
  }
  }

  function undoSort() {
    // Reverse the sorting and move the files back to their original folders
    const folder = document.getElementById('selected-folder').innerText
    if(!folder){
      alertError("Please open directory first!")
      return
    }
    if(fileTypes ===null || Object.keys(fileTypes).length === 0  ){
      alertError("Please sort then undo!")
      return
    }
    
    for (const fileType in fileTypes) {
      let newFolderPath
      if(allFeatures["isChecked"]){
      newFolderPath = path.join(folder, `${dirName}/${fileType}`);
        console.log(newFolderPath)
      }
      else{
        newFolderPath = path.join(folder, fileType);
      }
      if (fs.existsSync(newFolderPath)) {
        fileTypes[fileType].forEach(file => {
          const oldFilePath = path.join(newFolderPath, file);
          const newFilePath = path.join(folder, file);
          fs.renameSync(oldFilePath, newFilePath);
        });
        fs.rmdirSync(newFolderPath);
        
        
      }
    }
    if(allFeatures["isChecked"]){
      fs.rmdirSync(
        path.join(folder, `${dirName}`)
        );
    }
    fileTypes = null;
    alertSuccess("Operation Succesful.")
  }

  function alertSuccess(message) {
    Toastify.toast({
      text: message,
      duration: 3000,
      close: false,
      style: {
        background: 'green',
        color: 'white',
        textAlign: 'center',
      },
    });
  }
  
  function alertError(message) {
    Toastify.toast({
      text: message,
      duration: 3000,
      close: false,
      style: {
        background: 'red',
        color: 'white',
        textAlign: 'center',
      },
    });
  }
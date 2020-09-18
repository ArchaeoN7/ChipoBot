const fs = require('fs');
const path = require('path');

/**
 * Write error on a file log errorLog.json
 * @param {string} errorLog
 */
const registerError = (errorLog)=>{

    var datetime = new Date();
    const date = datetime.getDate() + "/" + datetime.getMonth() + "/" +
     datetime.getFullYear() + "_" + datetime.getHours()+ ":" + datetime.getMinutes()+
     ":" + datetime.getSeconds()+ "."+ datetime.getUTCMilliseconds();

      var jsonPath = path.join(__dirname, '..', '..', 'public', 'res', 'errorLog.json');
      fs.readFile(jsonPath, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data);
            obj.errors.push({log: errorLog, timestamp:date});
            json = JSON.stringify(obj);
            fs.writeFile(jsonPath, json, 'utf8', function(err) {
                if(err)
                    return console.log(err);
            });
    }});

}

module.exports=registerError;
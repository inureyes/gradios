let exec = require('child_process').exec;

console.log("your platform is "+ process.platform);
console.log("electron-packger will be run with [GLOBAL] package");

let command = "electron-packager . --ignore=node_modules/electron-packager --ignore=.git --overwrite --ignore=\"\\.git(ignore|modules)\" --out=app --platform="
let option = process.platform;

console.log("Running electron-packager! Please wait!");

exec(command + option,function (err, stdout, stderr) {
  console.log("");
  console.log("Finished!");
  console.log("");
  console.log("result --------------");
  console.log(stdout);
  console.log(stderr);
  if (err !== null) {
    console.log('error: ' + err);
  }
});
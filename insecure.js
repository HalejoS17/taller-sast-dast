const { exec } = require("child_process");

// ⚠️ Vulnerable a command injection si cmd viene de un usuario
function run(cmd) {
  exec(cmd, (err, stdout, stderr) => {
    console.log(stdout);
  });
}

run(process.argv[2]);

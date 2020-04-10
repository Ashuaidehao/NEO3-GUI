const { spawn } = require('child_process');
const path = require('path');
const isMac = process.platform === "darwin";
const isWin = process.platform === "win32";
// const appPath = remote.app.getAppPath();
// const isPack = remote.app.isPackaged;

class NodeManager {

    constructor() {
        console.log("node manager creating");
    }

    kill() {
        if (this.node) {
            this.node.kill();
            this.node = null;
        }
    }

    isRunning() {
        return !!this.node;
    }

    start(env) {
        this.node = this.runCommand("dotnet neo3-gui.dll", env);
    }

    runCommand(command, env) {
        const startPath = __dirname.replace("app.asar", "");
        console.log(startPath);
        const parentEnv = process.env;
        const childEnv = { ...parentEnv, ...env };
        if (isWin) {

        }
        else if (isMac) {
            childEnv.PATH = childEnv.PATH + ":/usr/local/share/dotnet";
        }
        else {

        }
        const ps = spawn(command, [], { shell: true, encoding: 'utf8', cwd: path.join(startPath, 'build-neo-node'), env: childEnv });
        // ps.stdout.setEncoding('utf8');
        ps.stdout.on('data', (data) => {
            // var str = iconv.decode(new Buffer(data), 'gbk')
            // console.log(data.toString());
        });
        ps.stderr.setEncoding('utf8');
        ps.stderr.on('data', (data) => {
            // var str = iconv.decode(Buffer.from(data, 'binary'), 'cp936')
            // console.log("error str:", str);
            console.error(data.toString());
        });
        return ps;
    }
}


module.exports = NodeManager;

// export default NodeManager;
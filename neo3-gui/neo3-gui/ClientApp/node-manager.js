const { spawn } = require('child_process');
const path = require('path');


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
        let startPath = __dirname.replace("app.asar", "");
        console.log(startPath);
        const ps = spawn(command, [], { shell: true, encoding: 'utf8', cwd: path.join(startPath, 'build-neo-node'), env });
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
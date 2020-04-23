import { spawn } from 'child_process';
import path from 'path';
import { remote } from 'electron';
import Config from "./config";

const isMac = process.platform === "darwin";
const isWin = process.platform === "win32";
const appPath = remote.app.getAppPath();
// const isPack = remote.app.isPackaged;

class NeoNode {

    constructor() {
        this.pendingSwitchTimer = null;
    }

    debounce = (fn, wait) => {
        if (this.pendingSwitchTimer !== null) {
            clearTimeout(this.pendingSwitchTimer);
        }
        this.pendingSwitchTimer = setTimeout(fn, wait);
    }


    kill() {
        if (this.node) {
            this.node.kill();
            this.node = null;
        }
    }

    start(env, errorCallback) {
        this.node = this.runCommand("dotnet neo3-gui.dll", env,
            errorCallback);
    }

    startNode(network, port, errorCallback) {
        const env = { NEO_NETWORK: network || "", NEO_GUI_PORT: port || "" };
        this.start(env, errorCallback);
    }

    /**
     * force restart node after 1 second (using config file)
     */
    switchNode(network) {
        if (network) {
            Config.changeNetwork(network);
        }

        let retryCount = 0;
        this.delayStartNode(retryCount);
    }

    delayStartNode(retryCount) {
        retryCount = retryCount || 0;
        if (retryCount > 3) {
            console.log("stop retry");
            return;
        }
        if (this.node) {
            this.node.kill();
        }
        this.debounce(() => {
            this.startNode(Config.Network, Config.Port,
                () => {
                    retryCount++;
                    console.log(retryCount + ":switch network fail:" + Config.Network);
                    this.delayStartNode(retryCount);
                })
        }, 1000);
    }

    runCommand(command, env, errorCallback) {
        const startPath = appPath.replace("app.asar", "");
        console.log("startPath:", startPath);
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
            if (errorCallback) {
                errorCallback(data.toString());;
            }
        });
        ps.env = env;
        return ps;
    }
}


const singleton = new NeoNode();
export default singleton;
import fs from "fs";
import path from 'path';
import { remote } from 'electron';

const appPath = remote.app.getAppPath().replace("app.asar", "");
const CONFIG_FILE_NAME = path.join(appPath, "gui-config.json");
class Config {
    constructor() {

        try {
            const file = fs.readFileSync(CONFIG_FILE_NAME, 'utf8');
            console.log(file);
            const config = JSON.parse(file);
            this.initConfig(config);
        } catch (error) {
            console.log(error);
            this.initConfig({});
            return;
        }
    }


    /**
     * init config object from json data
     */
    initConfig = (config) => {
        this.Port = config.Port || 8081;
        this.RPCURL = config.RPCURL || "http://localhost:" + this.Port;
        this.Language = config.Language || "";
        this.Network = config.Network || "private";
    }

    /**
     * save config file
     */
    saveConfig = () => {
        const json = JSON.stringify(this, null, 4);
        fs.writeFile(CONFIG_FILE_NAME, json, err => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }


    /**
     * change current using language and save config
     */
    changeLang = (lng) => {
        this.Language = lng;
        this.saveConfig();
    }

    /**
     * change current using network and save config
     */
    changeNetwork = (network) => {
        this.Network = network;
        this.saveConfig();
    }

}

const config = new Config();

export default config;
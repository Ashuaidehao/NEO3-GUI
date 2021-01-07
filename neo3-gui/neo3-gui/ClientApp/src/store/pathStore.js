/* eslint-disable */
import { observable, action } from "mobx";

class PathStore {
  @observable mainnet = "http://localhost:8081";
  @observable testnet = [];
}

export default PathStore;

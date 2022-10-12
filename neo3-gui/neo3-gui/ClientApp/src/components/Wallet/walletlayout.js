/* eslint-disable */
import React from "react";
import "antd/dist/antd.min.css";
import "../../static/css/menu.css";
import "../../static/css/wallet.css";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import MenuDown from "../Common/menudown";
import { HomeOutlined, WalletOutlined } from "@ant-design/icons";
import { withTranslation } from "react-i18next";

const { Sider } = Layout;
const { SubMenu } = Menu;

@withTranslation()
class Walletlayout extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div style={{ height: "100%" }}>
        <Sider className="menu-logo" style={{ height: "100%" }}>
          <Menu
            className="menu-scroll"
            theme="light"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
          >
            <Menu.Item>
              <Link to="/">
                <HomeOutlined />
                {t("sideBar.home")}
              </Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <WalletOutlined />
                  <span>{t("sideBar.wallet")}</span>
                </span>
              }
            >
              <Menu.Item key="1">
                <Link to="/wallet/walletlist">{t("sideBar.accounts")}</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/wallet/transaction">
                  {t("sideBar.transaction Records")}
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/wallet/transfer">{t("sideBar.transfer")}</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
          <MenuDown />
        </Sider>
      </div>
    );
  };
}

export default Walletlayout;

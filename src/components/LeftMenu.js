import React, { Component } from "react";
import { Menu, Icon, Button } from "antd";

/**
 * @description 左侧菜单
 */
class LeftMenu extends Component {
  render() {
    return (
      <div>
        <Menu mode="vertical">
          <Menu.Item key="1">
            <Icon type="line-chart" />
            <span><a href="/temp">气温曲线</a></span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="table" />
            <span><a href="/district">小区管理</a></span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="shop" />
            <span><a href="/building">楼宇管理</a></span>
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="border" />
            <span><a href="/unit">单元管理</a></span>
          </Menu.Item>
          <Menu.Item key="5">
            <Icon type="home" />
            <span><a href="/room">房间管理</a></span>
          </Menu.Item>
          <Menu.Item key="6">
            <Icon type="user" />
            <span><a href="/user">用户管理</a></span>
          </Menu.Item>
          <Menu.Item key="7">
            <Icon type="setting" />
            <span><a href="/permission">权限管理</a></span>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
export default LeftMenu;

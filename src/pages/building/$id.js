import React, { Component } from "react";
import { connect } from "dva";
import moment from "moment";
import { Breadcrumb, Button, Icon, Divider, List } from "antd";

@connect(state => ({ building: state.building }))
export default class Detail extends Component {
  componentDidMount() {
    let { id } = this.props.match.params;
    this.queryBuildingById(id);
  }
  goBackClick = e => {
    this.props.history.replace("/building");
  };
  queryBuildingById(id) {
    this.props.dispatch({ type: "building/queryBuildingById", payload: id });
  }
  renderDetail() {
    let { entity } = this.props.building;
    console.log(entity);
    if (entity.id) {
      return (
        <List header={entity.no} bordered={true}>
          <List.Item>
            <label>所属小区：</label>
            <span>{entity.name}</span>
          </List.Item>
          <List.Item>
            <label>楼号：</label>
            <span>{entity.no}</span>
          </List.Item>
          <List.Item>
            <label>创建时间：</label>
            <span>
              {moment(entity.createTime).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          </List.Item>
          <List.Item>
            <label>修改时间：</label>
            <span>
              {moment(entity.modifyTime).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          </List.Item>
          <List.Item>
            <label>修改时间：</label>
            <span>{entity.state == 1 ? "正常" : "禁用"}</span>
          </List.Item>
        </List>
      );
    }
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>楼宇管理</Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Button htmlType="button" onClick={this.goBackClick}>
            <Icon type="rollback" />
            <span>返回列表</span>
          </Button>
        </div>
        <Divider orientation="left" />
        {this.renderDetail()}
      </div>
    );
  }
}

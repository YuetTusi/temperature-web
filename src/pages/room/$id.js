import React, { Component } from "react";
import { Breadcrumb, Button, Icon, Divider, List } from "antd";
import { connect } from "dva";
import moment from "moment";

@connect(state => ({ room: state.room }))
export default class Detail extends Component {
  componentDidMount() {
    let { id } = this.props.match.params;
    this.queryRoomById(id);
  }
  queryRoomById(id) {
    this.props.dispatch({ type: "room/queryRoomById", payload: id });
  }
  goBackClick = e => {
    this.props.history.replace("/room");
  };
  renderDetail() {
    let { room } = this.props.room;
    return (
      <List title={room.no} bordered={true}>
        <List.Item>
          <label>所属小区：</label>
          <span>{room.districtName}</span>
        </List.Item>
        <List.Item>
          <label>所属楼栋：</label>
          <span>{room.buildingNo}</span>
        </List.Item>
        <List.Item>
          <label>所属单元：</label>
          <span>{room.unitName}</span>
        </List.Item>
        <List.Item>
          <label>房间：</label>
          <span>{room.no}</span>
        </List.Item>
        <List.Item>
          <label>创建时间：</label>
          <span>{moment(room.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
        </List.Item>
        <List.Item>
          <label>修改时间：</label>
          <span>{moment(room.modifyTime).format("YYYY-MM-DD HH:mm:ss")}</span>
        </List.Item>
        <List.Item>
          <label>状态：</label>
          <span>{room.state == 1 ? "正常" : "冻结"}</span>
        </List.Item>
      </List>
    );
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{ padding: "15px" }}>
          <Breadcrumb.Item>房间管理</Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Button htmlType="button" type="primary" onClick={this.goBackClick}>
            <Icon type="rollback" />
            <span>返回</span>
          </Button>
        </div>
        <Divider />
        <div style={{ paddingButtom: "15px" }}>{this.renderDetail()}</div>
      </div>
    );
  }
}

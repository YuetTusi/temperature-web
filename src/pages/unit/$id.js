import React, { Component } from "react";
import { connect } from "dva";
import { Breadcrumb, Divider, Button, Icon, List } from "antd";
import moment from "moment";

@connect(state => ({ unit: state.unit }))
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.goBackClick = this.goBackClick.bind(this);
  }
  componentDidMount() {
    let { id } = this.props.match.params;
    this.queryUnitDetail(id);
  }
  goBackClick(e) {
    this.props.history.replace("/unit");
  }
  /**
   * @description 渲染详情列表
   * @param {String} id
   */
  queryUnitDetail(id) {
    this.props.dispatch({ type: "unit/queryUnitById", payload: id });
  }
  renderDetail() {
    let { unit } = this.props.unit;
    return (
      <List header={unit.name} bordered={true}>
        <List.Item>
          <label>所属小区：</label>
          <span>{unit.districtName}</span>
        </List.Item>
        <List.Item>
          <label>所属栋栋：</label>
          <span>{unit.no}</span>
        </List.Item>
        <List.Item>
          <label>单元：</label>
          <span>{unit.name}</span>
        </List.Item>
        <List.Item>
          <label>创建时间：</label>
          <span>{moment(unit.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
        </List.Item>
        <List.Item>
          <label>修改时间：</label>
          <span>{moment(unit.modifyTime).format("YYYY-MM-DD HH:mm:ss")}</span>
        </List.Item>
        <List.Item>
          <label>状态：</label>
          <span>{unit.state === 1 ? "正常" : "冻结"}</span>
        </List.Item>
      </List>
    );
  }
  render() {
    this.renderDetail();
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>单元管理</Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Button htmlType="button" onClick={this.goBackClick}>
            <Icon type="rollback" />
            <span>返回</span>
          </Button>
        </div>
        <Divider />
        <div>{this.renderDetail()}</div>
      </div>
    );
  }
}

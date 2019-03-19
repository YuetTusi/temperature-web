import React, { Component } from "react";
import { connect } from "dva";
import { Breadcrumb, Divider, List, Button, Icon, Spin } from "antd";
import moment from "moment";
/**
 * @description 小区详情页
 */
@connect(state => ({ district: state.district }))
class Detail extends Component {
  componentDidMount() {
    let id = this.props.match.params.id;
    this.queryDistrictById(id);
  }
  goBackClick = e => {
    this.props.history.replace("/district");
  };
  queryDistrictById(id) {
    this.props.dispatch({
      type: "district/queryDistrictById",
      payload: id
    });
  }
  renderDetail() {
    let { entity } = this.props.district;
    let detailCompoent = null;
    if (this.props.district.entity.id) {
      detailCompoent = (
        <List header={entity.name} bordered={true}>
          <List.Item>
            <label>地址：</label>
            <span>{entity.address}</span>
          </List.Item>
          <List.Item>
            <label>热源：</label>
            <span>{entity.heat}</span>
          </List.Item>
          <List.Item>
            <label>创建时间：</label>
            <span>
              {moment(entity.createTime.toString()).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            </span>
          </List.Item>
          <List.Item>
            <label>更新时间：</label>
            <span>
              {moment(entity.modifyTime.toString()).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            </span>
          </List.Item>
          <List.Item>
            <label>状态：</label>
            <span>{entity.state === 1 ? "正常" : "禁用"}</span>
          </List.Item>
        </List>
      );
    } else {
      detailCompoent = <Spin />;
    }
    return detailCompoent;
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>小区管理</Breadcrumb.Item>
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
export default Detail;

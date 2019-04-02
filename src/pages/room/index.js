import React, { Component } from "react";
import {
  Breadcrumb,
  Divider,
  Form,
  Input,
  Table,
  Button,
  Select,
  Icon,
  Row,
  Col
} from "antd";
import { connect } from "dva";
import { getColumns } from "./data/columns";

@Form.create()
@connect(state => ({ room: state.room }))
export default class Index extends Component {
  componentDidMount() {
    this.queryRoomData({
      pageIndex: 1,
      pageSize: 5
    });
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formLayout = {
      // labelCol: { span: 18 }, //标签占宽
      // wrapperCol: { span: 6 }, //输入域占宽
      labelAlign: "right"
    };
    return (
      <Form layout="inline" {...formLayout}>
        <Row>
          <Col span={24}>
            <Form.Item label="所属小区">
              {getFieldDecorator("districtId", {})(<Select />)}
            </Form.Item>
            <Form.Item label="所属楼栋">
              {getFieldDecorator("buildingId", {})(<Select />)}
            </Form.Item>
            <Form.Item label="所属单元">
              {getFieldDecorator("unitId", {})(<Select />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="房间">
              {getFieldDecorator("no", {})(<Input />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary">
                <Icon type="search" />
                <span>查询</span>
              </Button>
            </Form.Item>
            <Form.Item>
              <Button>
                <Icon type="plus" />
                <span>添加</span>
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
  renderTable() {
    let columns = getColumns(this.props);
    const pagination = {
      current: this.props.room.pageIndex,
      pageSize: this.props.room.pageSize,
      total: this.props.room.totalRow
    };
    return (
      <Table
        columns={columns}
        size="small"
        border={true}
        locale={{ emptyText: "暂无数据" }}
        loading={this.props.room.isLoading}
        rowKey={r => r.id}
        pagination={pagination}
        dataSource={this.props.room.gridData}
      />
    );
  }
  queryRoomData(condition) {
    this.props.dispatch({ type: "room/queryRoomData", payload: condition });
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{ padding: "15px" }}>
          <Breadcrumb.Item>房间管理</Breadcrumb.Item>
        </Breadcrumb>
        {this.renderForm()}
        <Divider />
        {this.renderTable()}
      </div>
    );
  }
}

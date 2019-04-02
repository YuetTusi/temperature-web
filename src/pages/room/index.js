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
    this.queryDistrictSelect();
  }
  /**
   * 绑定小区下拉
   */
  queryDistrictSelect() {
    this.props.dispatch({ type: "room/queryDistrictSelect" });
  }
  /**
   * @description 绑定楼栋下拉
   * @param {String} id 小区id
   */
  queryBuildingSelectByDistrict(id) {
    this.props.dispatch({
      type: "room/queryBuildingSelectByDistrict",
      payload: id
    });
  }
  /**
   * @description 绑定单元下拉
   * @param {String} id 楼栋id
   */
  queryUnitSelectByBuilding(id) {
    this.props.dispatch({
      type: "room/queryUnitSelectByBuilding",
      payload: id
    });
  }
  renderDistrictSelect() {
    let { districtSelect } = this.props.room;

    let Option = Select.Option;
    if (districtSelect) {
      return districtSelect.map((item, index) => {
        return <Option key={item.id}>{item.name}</Option>;
      });
    }
  }
  renderBuildingSelect() {
    let { buildingSelect } = this.props.room;
    let Option = Select.Option;
    if (buildingSelect) {
      return buildingSelect.map((item, index) => {
        return <Option key={item.id}>{item.no}</Option>;
      });
    }
  }
  renderUnitSelect() {
    let Option = Select.Option;
    let { unitSelect } = this.props.room;
    if (unitSelect) {
      return unitSelect.map(item => {
        return <Option key={item.id}>{item.name}</Option>;
      });
    } else {
      return null;
    }
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formLayout = {
      labelCol: { span: 8 }, //标签占宽
      wrapperCol: { span: 16 }, //输入域占宽
      labelAlign: "right"
    };
    return (
      <Form layout="inline" onSubmit={this.searchFormSubmit}>
        <Row>
          <Col span={24}>
            <Form.Item label="所属小区">
              {getFieldDecorator("districtId", { initialValue: "" })(
                <Select
                  style={{ width: "150px" }}
                  onChange={this.districtSelectChange}
                  showSearch={true}
                  filterOption={(input, option) => {
                    return option.props.children.includes(input);
                  }}
                >
                  <Select.Option value="">- 全部 -</Select.Option>
                  {this.renderDistrictSelect()}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="所属楼栋">
              {getFieldDecorator("buildingId", { initialValue: "" })(
                <Select
                  style={{ width: "150px" }}
                  onChange={this.buildingSelectChange}
                  showSearch={true}
                  filterOption={(input, option) => {
                    return option.props.children.includes(input);
                  }}
                >
                  <Select.Option value="">- 全部 -</Select.Option>
                  {this.renderBuildingSelect()}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="所属单元">
              {getFieldDecorator("unitId", { initialValue: "" })(
                <Select
                  style={{ width: "150px" }}
                  showSearch={true}
                  filterOption={(input, option) => {
                    return option.props.children.includes(input);
                  }}
                >
                  <Select.Option value="">- 全部 -</Select.Option>
                  {this.renderUnitSelect()}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="房间" {...formLayout}>
              {getFieldDecorator("no", {})(<Input />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
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
  districtSelectChange = val => {
    let { setFieldsValue } = this.props.form;
    setFieldsValue({
      buildingId: "",
      unitId: ""
    });
    this.queryBuildingSelectByDistrict(val);
  };
  buildingSelectChange = val => {
    let { setFieldsValue } = this.props.form;
    setFieldsValue({ unitId: "" });
    this.queryUnitSelectByBuilding(val);
  };
  searchFormSubmit = e => {
    e.preventDefault();
    let { getFieldsValue } = this.props.form;
    let condition = getFieldsValue();
    this.queryRoomData({
      pageIndex: 1,
      pageSize: 5,
      ...condition
    });
  };
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

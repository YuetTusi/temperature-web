import React, { Component } from "react";
import { connect } from "dva";
import { getColumns } from "./data/columns";
import { keys } from "@/utils/keys.js";
import EditModal from "./components/EditModal";
import {
  Breadcrumb,
  Divider,
  Table,
  Form,
  Input,
  Button,
  Icon,
  Select
} from "antd";

/**
 * @description 楼宇管理
 */
@Form.create()
@connect(state => ({ building: state.building }))
export default class Building extends Component {
  // state = {
  //   keywords: "" //小区下拉输入关键字
  // };
  componentDidMount() {
    this.queryDistrictByKeywords();
    this.queryBuildData();
  }
  queryDistrictByKeywords(keywords = "") {
    this.props.dispatch({
      type: "building/queryDistrictByKeywords",
      payload: keywords
    });
  }
  queryBuildData(condition = {}) {
    this.props.dispatch({
      type: "building/queryBuildingData",
      payload: condition
    });
  }
  addClick = e => {
    this.props.dispatch({
      type: "building/toggleShowModal",
      payload: true
    });
  };
  editSaveClick = e => {
    const { validateFields } = this.editModal.props.form;
    validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: "building/saveBuildingData",
          payload: values
        });
      }
    });
  };
  cancelClick = e => {
    this.props.dispatch({
      type: "building/clearEntity"
    });
    this.props.dispatch({
      type: "building/toggleShowModal",
      payload: false
    });
  };
  searchFormSubmit = e => {
    e.preventDefault();
    const { getFieldsValue } = this.props.form;
    let condition = getFieldsValue();
    condition = {
      no: condition.conditionNo,
      districtId: condition.conditionDistrictId
    };
    this.queryBuildData(condition);
  };
  renderDistrictSelect() {
    let { districtList } = this.props.building;
    let options = [];
    if (districtList && districtList.length > 0) {
      options = districtList.map(i => {
        return <Select.Option key={i.id}>{i.name}</Select.Option>;
      });
    }
    return options;
  }
  renderTable() {
    const page = {
      current: this.props.building.pageIndex,
      pageSize: this.props.building.pageSize,
      total: this.props.building.total,
      onChange: (pageIndex, pageSize) => {
        this.props.dispatch({
          type: "building/queryBuildingData",
          payload: {
            pageIndex,
            pageSize
          }
        });
      }
    };
    return (
      <Table
        columns={getColumns(this.props)}
        bordered={true}
        size="small"
        loading={this.props.building.isLoading}
        rowKey={record => record.id}
        dataSource={this.props.building.data}
        pagination={page}
      />
    );
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.searchFormSubmit}>
        <Form.Item label="所属小区">
          {getFieldDecorator("conditionDistrictId")(
            <Select
              placeholder="所属小区"
              filterOption={(inputVal, option) =>
                option.props.children.includes(inputVal)
              }
              style={{ width: 200 }}
              showSearch={true}
              defaultActiveFirstOption={true}
            >
              <Select.Option key={keys()} value="">
                - 全部 -
              </Select.Option>
              {this.renderDistrictSelect()}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="楼号">
          {getFieldDecorator("conditionNo")(<Input placeholder="楼号" />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={this.searchClick} htmlType="submit">
            <Icon type="search" />
            <span>查询</span>
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={this.addClick}>
            <Icon type="plus" />
            <span>添加</span>
          </Button>
        </Form.Item>
      </Form>
    );
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>楼宇管理</Breadcrumb.Item>
        </Breadcrumb>
        {this.renderForm()}
        <Divider orientation="left" />
        {this.renderTable()}
        <EditModal
          title={this.props.building.entity.id ? "编辑楼宇" : "添加楼宇"}
          okText="保存"
          cancelText="取消"
          onOk={this.editSaveClick}
          onCancel={this.cancelClick}
          visible={this.props.building.showEditModal}
          wrappedComponentRef={m => {
            this.editModal = m;
          }}
        />
      </div>
    );
  }
}

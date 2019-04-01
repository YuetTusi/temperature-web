import React, { Component } from "react";
import { connect } from "dva";
import {
  Breadcrumb,
  Divider,
  Form,
  Button,
  Icon,
  Input,
  Select,
  Table
} from "antd";
import { getColumns } from "./data/columns";
import EditModal from "./components/EditModal";

@Form.create()
@connect(state => ({ unit: state.unit }))
export default class Index extends Component {
  componentDidMount() {
    this.queryDistrictSelectData();
    this.queryUnitData();
  }
  //添加按钮Click事件
  addClick = e => {
    this.props.dispatch({ type: "unit/toggleIsEdit", payload: false });
    this.props.dispatch({ type: "unit/toggleShowModal", payload: true });
  };
  saveClick = e => {
    const { validateFields } = this.editModalInstance.props.form;
    validateFields((err, values) => {
      if (!err) {
        delete values.districtId;
        this.props.dispatch({ type: "unit/saveUnit", payload: values });
      }
    });
  };
  cancelClick = e => {
    this.props.dispatch({ type: "unit/toggleShowModal", payload: false });
  };
  searchFormSubmit = e => {
    e.preventDefault();
    let { getFieldsValue } = this.props.form;
    let condition = getFieldsValue();
    condition = {
      districtId: condition.searchDistrictId,
      buildingId: condition.searchBuildingId,
      name: condition.searchName
    };
    this.queryUnitData(condition);
  };
  //小区下拉Change
  districtSelectChange = value => {
    let { setFieldsValue } = this.props.form;
    this.queryBuildingSelectData(value);
    setFieldsValue({
      searchBuildingId: ""
    });
  };
  //查询单元表格
  queryUnitData(condition = {}) {
    this.props.dispatch({ type: "unit/queryUnitData", payload: condition });
  }
  //小区下拉
  queryDistrictSelectData() {
    this.props.dispatch({ type: "unit/queryDistrictSelectData" });
  }
  //楼栋下拉
  queryBuildingSelectData(districtId) {
    districtId = districtId || "-1";
    this.props.dispatch({
      type: "unit/queryBuildingSelectData",
      payload: districtId
    });
  }
  renderDistrictSelect() {
    let { districtSelectData } = this.props.unit;
    let options = null;
    if (districtSelectData) {
      options = districtSelectData.map((item, i) => {
        return <Select.Option key={item.id}>{item.name}</Select.Option>;
      });
    }
    return options;
  }
  renderBuildingSelect() {
    let { buildingSelectData } = this.props.unit;
    let options = null;
    if (buildingSelectData) {
      options = buildingSelectData.map((item, i) => {
        return <Select.Option key={item.id}>{item.no}</Select.Option>;
      });
    }
    return options;
  }
  /**
   * @description 渲染查询条
   */
  renderForm() {
    let { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.searchFormSubmit}>
        <Form.Item label="所属小区">
          {getFieldDecorator("searchDistrictId", { initialValue: "" })(
            <Select
              style={{ width: 120 }}
              showSearch={true}
              filterOption={(input, option) =>
                option.props.children.includes(input)
              }
              onChange={this.districtSelectChange}
            >
              <Select.Option value="">- 全部 -</Select.Option>
              {this.renderDistrictSelect()}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="所属楼栋">
          {getFieldDecorator("searchBuildingId", { initialValue: "" })(
            <Select style={{ width: 120 }} showSearch={true}>
              <Select.Option value="">- 全部 -</Select.Option>
              {this.renderBuildingSelect()}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="单元">
          {getFieldDecorator("searchName")(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            <Icon type="search" />
            <span>查询</span>
          </Button>
        </Form.Item>
        <Form.Item>
          <Button htmlType="button" type="default" onClick={this.addClick}>
            <Icon type="plus" />
            <span>添加</span>
          </Button>
        </Form.Item>
      </Form>
    );
  }
  renderTable() {
    let columns = getColumns(this.props);
    const pagination = {
      current: this.props.unit.pageIndex,
      pageSize: this.props.unit.pageSize,
      total: this.props.unit.totalRow,
      onChange: (pageIndex, pageSize) => {
        let condition = this.props.form.getFieldsValue();
        condition = {
          ...condition,
          pageIndex,
          pageSize
        };
        this.props.dispatch({
          type: "unit/queryUnitData",
          payload: condition
        });
      }
    };
    return (
      <Table
        columns={columns}
        bordered={true}
        size="small"
        dataSource={this.props.unit.gridData}
        rowKey={r => r.id}
        locale={{ emptyText: "暂无数据" }}
        pagination={pagination}
        loading={this.props.unit.isLoading}
      />
    );
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>单元管理</Breadcrumb.Item>
        </Breadcrumb>
        {this.renderForm()}
        <Divider />
        {this.renderTable()}
        <EditModal
          title={this.props.isEdit ? "编辑单元" : "添加单元"}
          visible={this.props.unit.showModal}
          onOk={this.saveClick}
          onCancel={this.cancelClick}
          wrappedComponentRef={m => (this.editModalInstance = m)}
        />
      </div>
    );
  }
}

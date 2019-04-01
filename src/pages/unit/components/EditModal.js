import { Modal, Form, Input, Select, Button } from "antd";
import React, { Component } from "react";
import { connect } from "dva";

@Form.create()
@connect(state => ({ unit: state.unit }))
export default class EditModal extends Component {
  componentDidMount() {
    this.queryDistrictSelectData();
  }
  /**
   * @description 小区下拉
   */
  queryDistrictSelectData() {
    this.props.dispatch({ type: "unit/queryDistrictSelectData" });
  }
  /**
   * @description 楼栋下拉
   * @param {String} id  小区id
   */
  queryBuildingSelectData(id) {
    this.props.dispatch({ type: "unit/queryBuildingSelectData", payload: id });
  }
  districtSelectChange = input => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      buildingId: ""
    });
    this.queryBuildingSelectData(input);
  };
  renderDistrictSelect() {
    let { Option } = Select;
    return this.props.unit.districtSelectData.map((item, index) => {
      return <Option key={item.id}>{item.name}</Option>;
    });
  }
  renderBuildingSelect() {
    let { Option } = Select;
    return this.props.unit.buildingSelectData.map((item, index) => {
      return <Option key={item.id}>{item.no}</Option>;
    });
  }
  render() {
    let { unit } = this.props.unit;
    const formItemLayout = {
      labelCol: { span: 4 }, //标签占宽
      wrapperCol: { span: 18 } //输入域占宽
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.props.onOk}
        okText="保存"
        onCancel={this.props.onCancel}
        cancelText="取消"
        destroyOnClose={true}
      >
        <Form {...formItemLayout}>
          <Form.Item>
            {getFieldDecorator("id", {
              initialValue: unit.id
            })(<Input type="hidden" />)}
          </Form.Item>
          <Form.Item label="所属小区">
            {getFieldDecorator("districtId", {
              rules: [{ required: true, message: "请选择小区" }],
              initialValue: unit.districtId
            })(
              <Select onChange={this.districtSelectChange}>
                {this.renderDistrictSelect()}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="所属楼栋">
            {getFieldDecorator("buildingId", {
              rules: [{ required: true, message: "请选择楼栋" }],
              initialValue: unit.buildingId
            })(
              <Select notFoundContent={"暂无数据"}>
                {this.renderBuildingSelect()}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="单元">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请填写单元" }],
              initialValue: unit.name
            })(<Input />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator("state", {
              rules: [{ required: true }],
              initialValue:
                unit.state === undefined ? "1" : unit.state.toString()
            })(
              <Select>
                <Select.Option value="1">正常</Select.Option>
                <Select.Option value="0">冻结</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

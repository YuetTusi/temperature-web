import React, { Component } from "react";
import { Form, Select, Input, Modal } from "antd";
import { connect } from "dva";

/**
 * @description 编辑框
 */
@Form.create()
@connect(state => ({ room: state.room }))
export default class EditModal extends Component {
  componentDidMount() {
    this.queryDistrictSelect();
  }
  /**
   * @description 绑定小区下拉
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
  districtSelectChange = val => {
    let { setFieldsValue } = this.props.form;
    setFieldsValue({
      editBuildingId: "",
      editUnitId: ""
    });
    this.queryBuildingSelectByDistrict(val);
  };
  buildingSelectChange = val => {
    let { setFieldsValue } = this.props.form;
    setFieldsValue({ editUnitId: "" });
    this.queryUnitSelectByBuilding(val);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };
    const { room = {} } = this.props.room;
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        destroyOnClose={true}
        okText="保存"
        onOk={this.props.onOk}
        cancelText="取消"
        onCancel={this.props.onCancel}
      >
        <Form {...layout} layout="horizontal">
          <Form.Item>
            {getFieldDecorator("editId", { initialValue: room.id })(
              <Input type="hidden" />
            )}
          </Form.Item>
          <Form.Item label="所属小区">
            {getFieldDecorator("editDistrictId", {
              rules: [
                {
                  required: true,
                  message: "请填选择所属小区"
                }
              ],
              initialValue: room.districtId
            })(
              <Select
                onChange={this.districtSelectChange}
                filterOption={(input, options) =>
                  options.props.children.includes(input)
                }
                showSearch={true}
              >
                {this.renderDistrictSelect()}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="所属楼栋">
            {getFieldDecorator("editBuildingId", {
              rules: [
                {
                  required: true,
                  message: "请填选择所属楼栋"
                }
              ],
              initialValue: room.buildingId
            })(
              <Select onChange={this.buildingSelectChange}>
                {this.renderBuildingSelect()}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="所属单元">
            {getFieldDecorator("editUnitId", {
              rules: [
                {
                  required: true,
                  message: "请填选择所属单元"
                }
              ],
              initialValue: room.unitId
            })(<Select>{this.renderUnitSelect()}</Select>)}
          </Form.Item>
          <Form.Item label="房间">
            {getFieldDecorator("editNo", {
              rules: [
                {
                  required: true,
                  message: "请填写房间"
                }
              ],
              initialValue: room.no
            })(<Input />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator("editState", {
              rules: [
                {
                  required: true,
                  message: "请选择状态"
                }
              ],
              initialValue: room.state
            })(
              <Select>
                <Select.Option value={"1"}>正常</Select.Option>
                <Select.Option value={"0"}>冻结</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

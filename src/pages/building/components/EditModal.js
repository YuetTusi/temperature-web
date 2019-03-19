import React, { Component } from "react";
import { connect } from "dva";
import { Modal, Form, Input, Select } from "antd";

@Form.create()
@connect(state => ({ building: state.building }))
export default class EditModal extends Component {
  componentDidMount() {
    this.queryDistrictByKeywords();
  }
  queryDistrictByKeywords(keywords = "") {
    this.props.dispatch({
      type: "building/queryDistrictByKeywords",
      payload: keywords
    });
  }
  renderDistrictSelect() {
    let options = [];
    const { districtList } = this.props.building;
    const Option = Select.Option;
    if (districtList && districtList.length > 0) {
      options = districtList.map(i => {
        return <Option key={i.id}>{i.name}</Option>;
      });
    }
    return options;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };
    const { entity } = this.props.building;
    return (
      <Modal
        title={this.props.title}
        okText="保存"
        cancelText="取消"
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        visible={this.props.visible}
        destroyOnClose={true}
      >
        <Form {...formItemLayout}>
          <Form.Item>
            {getFieldDecorator("id", {
              initialValue: entity.id
            })(<Input type="hidden" />)}
          </Form.Item>
          <Form.Item label="所属小区">
            {getFieldDecorator("districtId", {
              rules: [{ required: true, message: "请选择小区" }],
              initialValue: entity.districtId
            })(
              <Select
                showSearch={true}
                filterOption={(inputVal, option) =>
                  option.props.children.includes(inputVal)
                }
              >
                {this.renderDistrictSelect()}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="楼号">
            {getFieldDecorator("no", {
              rules: [{ required: true, message: "请填写楼号" }],
              initialValue: entity.no
            })(<Input />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator("state", {
              initialValue: entity.state.toString()
            })(
              <Select>
                <Select.Option value="1">正常</Select.Option>
                <Select.Option value="0">禁用</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

import React from "react";
import { Modal, Form, Input, Select } from "antd";

/**
 * @description 小区编辑模态框
 */
@Form.create()
class EditModal extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const entity = this.props.entity;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };
    return (
      <Modal
        title={entity.id ? "编辑小区" : "添加小区"}
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        cancelText="取消"
        okText="保存"
        okType="primary"
        destroyOnClose={true}
      >
        <div>
          <Form layout="horizontal">
            <Form.Item>
              {getFieldDecorator("id", {
                initialValue: entity.id
              })(<Input type="hidden" />)}
            </Form.Item>
            <Form.Item label="名称" {...formItemLayout}>
              {getFieldDecorator("name", {
                initialValue: entity.name,
                rules: [{ required: true, message: "请填写名称" }]
              })(<Input placeholder="名称" />)}
            </Form.Item>
            <Form.Item label="地址" {...formItemLayout}>
              {getFieldDecorator("address", {
                initialValue: entity.address,
                rules: [{ required: true, message: "请填写地址" }]
              })(<Input placeholder="地址" />)}
            </Form.Item>
            <Form.Item label="热源" {...formItemLayout}>
              {getFieldDecorator("heat", {
                initialValue: entity.heat,
                rules: [{ required: true, message: "请填写热源" }]
              })(<Input placeholder="热源" />)}
            </Form.Item>
            <Form.Item label="状态" {...formItemLayout}>
              {getFieldDecorator("state", {
                initialValue: entity.state.toString(),
                defaultValue: 1
              })(
                <Select>
                  <Option value="1">正常</Option>
                  <Option value="0">禁用</Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}
export default EditModal;

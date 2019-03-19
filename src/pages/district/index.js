import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  message,
  Table,
  Divider,
  Breadcrumb,
  Icon
} from "antd";
import EditModal from "./components/EditModel";
import { getDirectColumns } from "./data/columns";
import { connect } from "dva";

/**
 * @description 小区查询页
 */
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.queryGridData({});
  }
  /**
   * @description 表格查询
   * @param {Object} condition  查询条件
   */
  queryGridData(condition) {
    this.props.dispatch({ type: "district/toggleLoadingState", payload: true });
    this.props.dispatch({
      type: "district/queryDistrictData",
      payload: condition
    });
  }
  /**
   * @description 查询按钮Click
   */
  formSearchClick = e => {
    e.preventDefault();
    let condition = this.props.form.getFieldsValue();
    this.queryGridData({
      name: condition.conditionName,
      address: condition.conditionAddress
    });
  };
  /**
   * @description 打开编辑框
   */
  addClick = e => {
    this.props.dispatch({ type: "district/showEditModal", payload: true });
  };
  /**
   * @description 模态框保存
   */
  saveClick = e => {
    this.editModal.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: "district/saveDistrict", payload: values });
      }
    });
  };
  /**
   * @description 模态框关闭
   */
  cancelClick = e => {
    this.props.dispatch({ type: "district/hideEditModal" });
    this.props.dispatch({ type: "district/clearEntity" });
  };
  showError() {
    if (this.props.district.errorInfo) {
      message.error("操作失败，请重试");
      this.props.dispatch({ type: "district/errorInfo" });
    }
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.formSearchClick}>
        <Form.Item label="名称">
          {getFieldDecorator("conditionName")(<Input placeholder="名称" />)}
        </Form.Item>
        <Form.Item label="地址">
          {getFieldDecorator("conditionAddress")(<Input placeholder="地址" />)}
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
  renderGrid() {
    const pagination = {
      current: this.props.district.pageIndex,
      pageSize: this.props.district.pageSize,
      total: this.props.district.total,
      onChange: (pageIndex, pageSize) => {
        let condition = this.props.form.getFieldsValue();
        condition = { ...condition, pageIndex, pageSize };
        this.queryGridData(condition);
      }
    };
    // this.setState({ isLoading: false });
    return (
      <Table
        dataSource={this.props.district.data}
        columns={getDirectColumns(this.props)}
        pagination={pagination}
        loading={this.props.district.isLoading}
        rowKey={record => record.id}
        size="small"
        bordered
      />
    );
  }
  render() {
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        </Breadcrumb>
        {this.renderForm()}
        <Divider orientation="left" />
        {this.renderGrid()}
        <EditModal
          entity={this.props.district.entity}
          onOk={this.saveClick}
          onCancel={this.cancelClick}
          visible={this.props.district.showEditModal}
          wrappedComponentRef={m => {
            this.editModal = m;
          }}
        />
      </div>
    );
  }
}

// const DistrictIndex = Form.create()(Index);
export default connect(state => ({ district: state.district }))(Index);

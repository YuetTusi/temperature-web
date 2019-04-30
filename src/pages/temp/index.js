import React, { Component } from "react";
import {
  Form,
  Button,
  Icon,
  Select,
  Breadcrumb,
  Divider,
  Col,
  Row,
  DatePicker,
  message
} from "antd";
import moment from "moment";
import echarts from "echarts";
import zhCn from "antd/lib/date-picker/locale/zh_CN";
import { connect } from "dva";

@Form.create()
@connect(state => ({ temp: state.temp }))
export default class Index extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.queryDistrictSelect();
  }
  searchClick = e => {
    const { getFieldsValue } = this.props.form;
    let parameters = getFieldsValue();
    if (parameters.roomNo) {
      this.queryChartData(
        parameters.roomNo,
        parameters.startTime.format("YYYY-MM-DD"),
        parameters.endTime.format("YYYY-MM-DD")
      );
    } else {
      message.warning("请选择房间");
    }
  };
  districtSelectChange = input => {
    this.queryBuildingSelectByDistrict(input);
  };
  buildingSelectChange = input => {
    this.queryUnitSelectByBuilding(input);
  };
  unitSelectChange = input => {
    this.queryRoomByUnit(input);
  };
  queryDistrictSelect() {
    this.props.dispatch({ type: "temp/queryDistrictSelect" });
  }
  queryBuildingSelectByDistrict(id) {
    this.props.dispatch({
      type: "temp/queryBuildingSelectByDistrict",
      payload: id
    });
  }
  queryUnitSelectByBuilding(id) {
    this.props.dispatch({
      type: "temp/queryUnitSelectByBuilding",
      payload: id
    });
  }
  queryRoomByUnit(id) {
    this.props.dispatch({
      type: "temp/queryRoomByUnit",
      payload: id
    });
  }
  queryChartData(roomNo, startTime, endTime) {
    this.props.dispatch({
      type: "temp/queryChartData",
      payload: {
        roomNo,
        startTime,
        endTime
      }
    });
  }
  renderDistrictSelect() {
    let { districtSelect } = this.props.temp;
    if (districtSelect) {
      return districtSelect.map((item, index) => {
        return <Select.Option key={item.id}>{item.name}</Select.Option>;
      });
    } else {
      return null;
    }
  }
  renderBuildingSelect() {
    let { buildingSelect } = this.props.temp;
    if (buildingSelect) {
      return buildingSelect.map((item, index) => {
        return <Select.Option key={item.id}>{item.no}</Select.Option>;
      });
    } else {
      return null;
    }
  }
  renderUnitSelect() {
    let { unitSelect } = this.props.temp;
    if (unitSelect) {
      return unitSelect.map((item, index) => {
        return <Select.Option key={item.id}>{item.name}</Select.Option>;
      });
    } else {
      return null;
    }
  }
  renderRoomSelect() {
    let { roomSelect } = this.props.temp;
    if (roomSelect) {
      return roomSelect.map((item, index) => {
        return <Select.Option key={item.id}>{item.no}</Select.Option>;
      });
    } else {
      return null;
    }
  }
  renderForm() {
    this.renderDistrictSelect();
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row>
          <Col span={24}>
            <Form.Item label="所属小区">
              {getFieldDecorator("districtId", {
                initialValue: ""
              })(
                <Select
                  style={{ width: "120px" }}
                  onChange={this.districtSelectChange}
                >
                  <Select.Option value="">- 全部 -</Select.Option>
                  {this.renderDistrictSelect()}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="所属楼栋">
              {getFieldDecorator("buildingId", {
                initialValue: ""
              })(
                <Select
                  style={{ width: "120px" }}
                  onChange={this.buildingSelectChange}
                >
                  <Select.Option value="">- 全部 -</Select.Option>
                  {this.renderBuildingSelect()}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="所属单元">
              {getFieldDecorator("unitId", { initialValue: "" })(
                <Select
                  style={{ width: "120px" }}
                  onChange={this.unitSelectChange}
                  showSearch={true}
                  filterOption={(input, options) =>
                    options.props.children.includes(input)
                  }
                >
                  <Select.Option value="">- 全部 -</Select.Option>
                  {this.renderUnitSelect()}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="房间">
              {getFieldDecorator("roomNo", {
                initialValue: ""
              })(
                <Select
                  style={{ width: "120px" }}
                  showSearch={true}
                  filterOption={(input, options) =>
                    options.props.children.includes(input)
                  }
                >
                  <Select.Option value="">- 全部-</Select.Option>
                  {this.renderRoomSelect()}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="起始日">
              {getFieldDecorator("startTime", {
                initialValue: moment().add(-7, "days")
              })(<DatePicker locale={zhCn} placeholder="起始日" />)}
            </Form.Item>
            <Form.Item label="终止日">
              {getFieldDecorator("endTime", {
                initialValue: moment()
              })(<DatePicker locale={zhCn} placeholder="终止日" />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.searchClick}>
                <Icon type="search" />
                <span>查询</span>
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
  loadChart = e => {
    let { chartData } = this.props.temp;
    if (chartData && chartData.length > 0) {
      let option = {
        title: {
          text: "气温曲线数据"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          formatter: "{b0} <br/> {a0}:{c0}℃ <br/> {a1}:{c1} "
        },
        legend: {
          show: true,
          bottom: 10,
          data: ["最高气温", "最低气温"]
        },
        xAxis: {
          type: "category",
          data: chartData.map(item =>
            moment(item.recordDate).format("YYYY-MM-DD")
          )
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}℃"
          }
        },
        series: [
          {
            name: "最高气温",
            data: chartData.map(item => item.high),
            type: "line",
            smooth: true
          },
          {
            name: "最低气温",
            data: chartData.map(item => item.low),
            type: "line",
            smooth: true
          }
        ]
      };
      if (this.chartDom) {
        echarts.init(this.chartDom).setOption(option);
      }
    } else {
      if (this.chartDom) {
        echarts.init(this.chartDom).clear();
      }
    }
  };
  render() {
    return (
      <div>
        <Breadcrumb style={{ padding: "15px" }}>
          <Breadcrumb.Item>气温曲线</Breadcrumb.Item>
        </Breadcrumb>
        {this.renderForm()}
        {setTimeout(() => {
          this.loadChart();
        })}
        <Divider />
        <div
          style={{
            width: "100%",
            height: "400px",
            overflow: "auto"
          }}
          ref={c => (this.chartDom = c)}
        />
      </div>
    );
  }
}

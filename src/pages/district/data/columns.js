import moment from "moment";
import { message } from "antd";
import { showConfirm } from "../components/Comfirm";
import { Link } from "dva/router";
/**
 * @description 小区表头配置
 * @param {Object} param0 Index组件props属性
 */
function getDirectColumns({ dispatch, district }, delDistrictData) {
  const columns = [
    {
      title: "名称",
      key: "name",
      dataIndex: "name",
      render(text, record) {
        return <Link to={`district/${record.id}`}>{text}</Link>;
      }
    },
    {
      title: "地址",
      key: "address",
      dataIndex: "address"
    },
    {
      title: "热源",
      key: "heat",
      dataIndex: "heat"
    },
    {
      title: "创建时间",
      key: "createTime",
      dataIndex: "createTime",
      render(val) {
        return <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    },
    {
      title: "更新时间",
      key: "modifyTime",
      dataIndex: "modifyTime",
      render(val) {
        return <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    },
    {
      title: "状态",
      key: "state",
      dataIndex: "state",
      render(val) {
        return <span>{val === 1 ? "正常" : "禁用"}</span>;
      }
    },
    {
      title: "编辑",
      key: "edit",
      align: "center",
      dataIndex: "edit",
      render(text, record) {
        return (
          <a
            data-id={record.id}
            onClick={() => {
              dispatch({
                type: "district/queryDistrictById",
                payload: record.id
              });
              dispatch({ type: "district/showEditModal" });
            }}
          >
            编辑
          </a>
        );
      }
    },
    {
      title: "删除",
      key: "del",
      align: "center",
      dataIndex: "del",
      render(text, record) {
        return (
          <a
            data-id={record.id}
            onClick={() => {
              showConfirm(
                "删除",
                `确定删除「${record.name}」的数据吗？`,
                () => {
                  dispatch({
                    type: "district/deleteDistrict",
                    payload: record.id
                  });
                }
              );
            }}
          >
            删除
          </a>
        );
      }
    }
  ];
  return columns;
}

export { getDirectColumns };

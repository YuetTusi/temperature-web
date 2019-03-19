import moment from "moment";
import { showConfirm } from "@/components/Confirm";
import { Link } from "dva/router";

function getColumns({ dispatch }) {
  let columns = [
    {
      title: "所属小区",
      key: "name",
      dataIndex: "name"
    },
    {
      title: "楼号",
      key: "no",
      dataIndex: "no",
      render(text, record) {
        return <Link to={`/building/${record.id}`}>{text}</Link>;
      }
    },
    {
      title: "创建时间",
      key: "createTime",
      dataIndex: "createTime",
      render(text, record) {
        return <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    },
    {
      title: "更新时间",
      key: "modifyTime",
      dataIndex: "modifyTime",
      render(text, record) {
        return <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    },
    {
      title: "状态",
      key: "state",
      dataIndex: "state",
      align: "center",
      render: (text, record) => {
        return <span>{record.state == 1 ? "正常" : "禁用"}</span>;
      }
    },
    {
      title: "编辑",
      key: "edit",
      dataIndex: "edit",
      align: "center",
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              dispatch({
                type: "building/queryBuildingById",
                payload: record.id
              });
              dispatch({
                type: "building/toggleShowModal",
                payload: true
              });
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
      dataIndex: "del",
      align: "center",
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              showConfirm("删除", `确定删除「${record.no}」的数据吗？`, () => {
                dispatch({
                  type: "building/deleteBuildingData",
                  payload: record.id
                });
              });
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

export { getColumns };

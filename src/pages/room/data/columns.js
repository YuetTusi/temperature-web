import moment from "moment";
import { Link } from "dva/router";
import { showConfirm } from "@/components/Confirm";

function getColumns({ dispatch }) {
  let columns = [
    {
      title: "所属小区",
      dataIndex: "districtName",
      key: "districtName"
    },
    {
      title: "所属楼栋",
      dataIndex: "buildingNo",
      key: "buildingNo"
    },
    {
      title: "所属单元",
      dataIndex: "unitName",
      key: "unitName"
    },
    {
      title: "房间号",
      dataIndex: "no",
      key: "no",
      render(text, record) {
        return <Link to={`room/${record.id}`}>{text}</Link>;
      }
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render(text, record) {
        return <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    },
    {
      title: "修改时间",
      dataIndex: "modifyTime",
      key: "modifyTime",
      render(text, record) {
        return <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      render(text, record) {
        return <span>{record.state === "1" ? "正常" : "冻结"}</span>;
      }
    },
    {
      title: "编辑",
      dataIndex: "edit",
      align: "center",
      render(text, record) {
        return (
          <a
            onClick={e => {
              dispatch({ type: "room/queryRoomById", payload: record.id });
              dispatch({
                type: "room/queryBuildingSelectByDistrict",
                payload: record.districtId
              });
              dispatch({
                type: "room/queryUnitSelectByBuilding",
                payload: record.buildingId
              });
              dispatch({ type: "room/toggleIsShow", payload: true });
            }}
          >
            编辑
          </a>
        );
      }
    },
    {
      title: "删除",
      dataIndex: "del",
      align: "center",
      render(text, record) {
        return (
          <a
            onClick={e => {
              showConfirm(
                "询问",
                `确认删除「${record.no}房间」数据码？`,
                () => {
                  dispatch({ type: "room/delRoom", payload: record.id });
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
export { getColumns };

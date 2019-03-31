import moment from "moment";

function getColumns({ dispatch }) {
  let columns = [
    {
      title: "所属小区",
      key: "districtName",
      dataIndex: "districtName"
    },
    {
      title: "所属楼栋",
      key: "buildingNo",
      dataIndex: "buildingNo"
    },
    {
      title: "单元",
      key: "name",
      dataIndex: "name",
      render(text, record) {
        return (
          <a data-id={record.id} href={`unit/${record.id}`}>
            {text}
          </a>
        );
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
      title: "修改时间",
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
      render(text, record) {
        return <span>{record.state === 1 ? "正常" : "冻结"}</span>;
      }
    },
    {
      title: "编辑",
      key: "edit",
      render(text, record) {
        return <a data-id={record.id}>编辑</a>;
      },
      align: "center"
    },
    {
      title: "删除",
      key: "del",
      align: "center",
      render(text, record) {
        return <a data-id={record.id}>删除</a>;
      }
    }
  ];

  return columns;
}

export { getColumns };

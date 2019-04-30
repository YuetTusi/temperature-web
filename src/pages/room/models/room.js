import { request } from "@/utils/request";
import { message } from "antd";
/**
 * 房间Room
 */
let model = {
  namespace: "room",
  state: {
    pageIndex: 1,
    pageSize: 5,
    totalRow: 0,
    gridData: [],
    isLoading: false, //正在读取标志
    errorMessage: null,
    districtSelect: [], //小区select
    buildingSelect: [], //楼栋select
    unitSelect: [], //单元select
    room: {}, //房间详情
    isShowModal: false //是否打开编辑框
  },
  reducers: {
    setRoomGirdData(state, action) {
      return {
        ...state,
        pageIndex: action.payload.pageIndex,
        pageSize: action.payload.pageSize,
        totalRow: action.payload.totalRow,
        gridData: [...action.payload.data]
      };
    },
    toggleIsLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload
      };
    },
    setDistrictSelect(state, action) {
      return {
        ...state,
        districtSelect: [...action.payload]
      };
    },
    setBuildingSelect(state, action) {
      return {
        ...state,
        buildingSelect: [...action.payload]
      };
    },
    setUnitSelect(state, action) {
      return {
        ...state,
        unitSelect: [...action.payload]
      };
    },

    setRoom(state, action) {
      return {
        ...state,
        room: {
          ...action.payload
        }
      };
    },
    toggleIsShow(state, action) {
      return {
        ...state,
        isShowModal: action.payload
      };
    },
    clearRoom(state, action) {
      return {
        ...state,
        room: Object.create(null)
      };
    },
    setErrorMessage(state, action) {
      return {
        ...state,
        errorMessage: action.payload
      };
    }
  },
  effects: {
    /**
     * @description 房间表格查询
     * @param {Object} param0 查询条件
     * @param {Object} param1 SagaEffect
     */
    *queryRoomData({ payload }, { put, call }) {
      const url = `room/${payload.pageSize}/${payload.pageIndex}`;
      yield put({ type: "toggleIsLoading", payload: true });
      let { code, data, error, totalRow } = yield call(request, {
        url,
        method: "POST",
        data: payload
      });
      if (code === 0) {
        yield put({
          type: "setRoomGirdData",
          payload: {
            data,
            totalRow,
            pageIndex: payload.pageIndex,
            pageSize: payload.pageSize
          }
        });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
      yield put({ type: "toggleIsLoading", payload: false });
    },
    /**
     * @description 查询 小区下拉
     * @param {Object} param0 无参数
     * @param {Object} param1 SagaEffect
     */
    *queryDistrictSelect({ payload }, { call, put }) {
      const url = "district";
      let { code, data, error } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setDistrictSelect", payload: data });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    },
    /**
     * @description 查询小区下的楼栋下拉
     * @param {Object} param0 小区id
     * @param {Object} param1 SagaEffect
     */
    *queryBuildingSelectByDistrict({ payload }, { call, put }) {
      payload = payload ? payload : "-1";
      const url = `building/${payload}/district`;
      let { data, code, error } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setBuildingSelect", payload: data });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    },
    /**
     * @description 查询楼栋下的单元
     * @param {Object} param0 楼栋id
     * @param {Object} param1 SagaEffect
     */
    *queryUnitSelectByBuilding({ payload }, { call, put }) {
      payload = payload ? payload : "-1";
      const url = `unit/${payload}/building`;
      let { data, code, error } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setUnitSelect", payload: data });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    },
    /**
     * @description 按id查询详情
     * @param {Object} param0 房间id
     * @param {Object} param1 SagaEffect
     */
    *queryRoomById({ payload }, { call, put }) {
      const url = `room/${payload}`;
      let { code, data, error } = yield call(request, { url });
      if (code === 0) {
        data = data.length > 0 ? data[0] : {};
        yield put({ type: "setRoom", payload: data });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    },
    /**
     * @description 保存房间实体（无id为新增操作）
     * @param {Object} payload 房间实体
     * @param {Object} effects SagaEffect
     */
    *saveOrUpdateRoom({ payload }, { call, put }) {
      const url = "room";
      let method = payload.id ? "PUT" : "POST";
      let { code, error } = yield call(request, {
        url,
        method,
        data: payload
      });
      if (code === 0) {
        yield put({
          type: "queryRoomData",
          payload: { pageIndex: 1, pageSize: 5 }
        });
        yield put({ type: "toggleIsShow", payload: false });
        yield put({ type: "clearRoom" });
      } else {
        message.warning("数据保存失败");
        yield put({ type: "setErrorMessage", error });
      }
    },
    /**
     * @description 删除房间
     * @param {Object} param0 id
     * @param {Object} param1 SagaEffect
     */
    *delRoom({ payload }, { call, put }) {
      const url = `room/${payload}`;
      let { code, error } = yield call(request, { url, method: "DELETE" });
      if (code === 0) {
        yield put({
          type: "queryRoomData",
          payload: { pageIndex: 1, pageSize: 5 }
        });
      } else {
        message.warning("数据删除失败");
        yield put({ type: "setErrorMessage", payload: error });
      }
    }
  }
};
export default model;

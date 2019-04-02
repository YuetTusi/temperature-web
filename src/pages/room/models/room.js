import { request } from "@/utils/request";

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
    unitSelect: [] //单元select
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
    }
  }
};
export default model;

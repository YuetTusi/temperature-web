import { request } from "@/utils/request";

const model = {
  namespace: "unit",
  state: {
    pageIndex: 1,
    pageSize: 5,
    gridData: [],
    totalRow: 0,
    districtSelectData: [], //小区下拉
    buildingSelectData: [], //楼栋下拉
    unit: {},
    errorMessage: null //错误消息
  },
  reducers: {
    setDistrictSelectData(state, action) {
      return {
        ...state,
        districtSelectData: [...action.payload]
      };
    },
    setBuildingSelectData(state, action) {
      return {
        ...state,
        buildingSelectData: [...action.payload]
      };
    },
    setGridData(state, action) {
      return {
        ...state,
        pageIndex: action.payload.pageIndex,
        pageSize: action.payload.pageSize,
        gridData: [...action.payload.data],
        totalRow: action.payload.totalRow
      };
    },
    setErrorMessage(state, action) {
      return {
        ...state,
        errorMessage: action.payload
      };
    },
    setUnitDetail(state, action) {
      return {
        ...state,
        unit: {
          ...action.payload
        }
      };
    }
  },
  effects: {
    /**
     * @description 查询单元表格数据
     * @param {Object} param0 查询条件
     * @param {Object} param1 SagaEffect
     */
    *queryUnitData({ payload }, { call, put }) {
      let { pageIndex = 1, pageSize = 5 } = payload;
      const url = `unit/${pageSize}/${pageIndex}`;
      let { code, data, totalRow, error } = yield call(request, {
        url,
        data: payload,
        method: "POST"
      });
      if (code === 0) {
        yield put({
          type: "setGridData",
          payload: { data, totalRow, pageIndex, pageSize }
        });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    },
    /**
     * @description 查询小区下拉数据
     * @param {Object} param0 参数
     * @param {Object} param1 SagaEffect
     */
    *queryDistrictSelectData({ payload }, { call, put }) {
      const url = "district";
      let { code, data, error } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setDistrictSelectData", payload: data });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    },
    /**
     * @description 查询小区下的楼栋数据
     * @param {Object} param0 参数
     * @param {Object} param1 SagaEffect
     */
    *queryBuildingSelectData({ payload }, { call, put }) {
      const url = `building/${payload}/district`;
      let { code, data, error } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setBuildingSelectData", payload: data });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    },
    /**
     * @description 按id查询详情
     * @param {Obejct} param0 参数（id）
     * @param {Object} param1  SagaEffect
     */
    *queryUnitById({ payload }, { call, put }) {
      //setUnitDetail
      let url = `unit/${payload}`;
      let { code, data, error } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setUnitDetail", payload: data });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    }
  }
};

export default model;

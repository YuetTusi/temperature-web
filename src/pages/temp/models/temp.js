import { request } from "@/utils/request";

let model = {
  namespace: "temp",
  state: {
    districtSelect: [], //小区select
    buildingSelect: [], //楼栋select
    unitSelect: [], //单元select
    chartData: [], //气温曲线数据
    errorMessage: null
  },
  reducers: {
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
    setRoomSelect(state, action) {
      return {
        ...state,
        roomSelect: [...action.payload]
      };
    },
    setChartData(state, action) {
      return {
        ...state,
        chartData: [...action.payload]
      };
    },
    setErrorMessage(state, action) {
      return {
        ...state,
        errorMessage: {
          ...action.payload
        }
      };
    }
  },
  effects: {
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
     * @description 查询单元下的房间
     * @param {Object} param0 单元id
     * @param {*} param1 SagaEffect
     */
    *queryRoomByUnit({ payload }, { call, put }) {
      let url = `room/${payload}/unit`;

      console.log(url);
      let { data, code, error } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setRoomSelect", payload: data });
      }
    },
    /**
     *
     * @param {Object} param0  参数
     * @param {*} param1 SagaEffects
     */
    *queryChartData({ payload }, { call, put }) {
      const url = `temp/${payload.roomNo}`;
      let { code, data, error } = yield call(request, {
        url,
        method: "POST",
        data: payload
      });

      if (code === 0) {
        yield put({ type: "setChartData", payload: data });
      } else {
        yield put({ type: "setErrorMessage", payload: error });
      }
    }
  }
};
export default model;

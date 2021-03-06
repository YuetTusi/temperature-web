import { request } from "@/utils/request";
import { message } from "antd";

let model = {
  namespace: "district",
  state: {
    data: [], //表格数据
    total: 0, //总记录数
    pageIndex: 1,
    pageSize: 5,
    isLoading: false, //加载中
    showEditModal: false, //显示模态框
    errorInfo: "", //错误消息
    entity: {
      //编辑或添加的实体数据
      id: "", //当存在主键，视为编辑
      name: "",
      address: "",
      heat: "",
      state: 1
    },
    buildingCount: 0 //小区下的楼栋数量
  },
  reducers: {
    loadDistrictData(state, action) {
      return {
        ...state,
        data: [...action.payload.data],
        total: action.payload.total,
        pageIndex: parseInt(action.payload.pageIndex),
        pageSize: parseInt(action.payload.pageSize)
      };
    },
    toggleLoadingState(state, action) {
      return {
        ...state,
        isLoading: action.payload
      };
    },
    showEditModal(state) {
      return {
        ...state,
        showEditModal: true
      };
    },
    hideEditModal(state) {
      return {
        ...state,
        showEditModal: false
      };
    },
    setEntity(state, action) {
      return {
        ...state,
        entity: {
          ...action.payload
        }
      };
    },
    /**
     * @description 清空当前实体对象
     * @param {Object} state
     */
    clearEntity(state) {
      return {
        ...state,
        entity: {
          id: "",
          name: "",
          address: "",
          heat: "",
          state: 1
        }
      };
    },
    setErrorInfo(state, action) {
      return {
        ...state,
        errorInfo: action.payload
      };
    },
    clearErrorInfo(state) {
      return {
        ...state,
        errorInfo: ""
      };
    },
    setBuildingCount(state, action) {
      return {
        ...state,
        buildingCount: Number.parseInt(action.payload)
      };
    }
  },
  effects: {
    *queryDistrictData({ payload }, { call, put }) {
      payload.pageSize = payload.pageSize || 5;
      payload.pageIndex = payload.pageIndex || 1;
      const url = `district/${payload.pageSize}/${payload.pageIndex}`;
      let { data, code, total, pageIndex, pageSize } = yield call(request, {
        method: "POST",
        url,
        data: payload
      });
      if (code === 0) {
        yield put({
          type: "loadDistrictData",
          payload: { data, total, pageIndex, pageSize }
        });
        yield put({ type: "toggleLoadingState", payload: false });
      }
    },
    /**
     * @description 按主键查询小区
     * @param {Object} Action
     * @param {Object} SagaEffect
     */
    *queryDistrictById({ payload }, { call, put }) {
      const url = `district/${payload}`;
      let { code, data } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setEntity", payload: data });
      }
    },
    /**
     * @description 保存小区数据
     * @param {Object} Action
     * @param {Object} SagaEffect
     */
    *saveDistrict({ payload }, { call, put }) {
      const url = `district`;
      let result = null;

      if (payload.id) {
        //编辑
        result = yield call(request, {
          url,
          method: "put",
          data: payload
        });
      } else {
        //新增
        result = yield call(request, {
          url,
          method: "post",
          data: payload
        });
      }

      if (result.code === 0) {
        yield put({ type: "queryDistrictData", payload: {} });
        yield put({ type: "hideEditModal" });
        yield put({ type: "clearEntity" });
      } else {
        yield put({ type: "setErrorInfo", payload: result.error });
      }
    },
    /**
     * @description 删除小区数据
     * @param {Object} Action payload为主键
     * @param {Object} SagaEffect
     */
    *deleteDistrict({ payload }, { call, put, select }) {
      const url = `district/${payload}`;
      yield put.resolve({ type: "queryBuildingCount", payload }); //put.resolve为派发“阻塞”Action
      let {
        district: { buildingCount }
      } = yield select();
      if (buildingCount === 0) {
        let { code } = yield call(request, {
          url,
          method: "delete"
        });
        if (code === 0) {
          yield put({ type: "queryDistrictData", payload: {} });
        } else {
          yield put({ type: "errorInfo" });
        }
      } else {
        message.warning("该小区下存在楼栋数据，不可删除");
      }
    },
    /**
     * @description 查询小区下的楼栋数量
     * @param {Object} param0 小区id
     * @param {Object} param1 SagaEffect
     */
    *queryBuildingCount({ payload }, { call, put }) {
      const url = `district/${payload}/building`;
      let { data, code, error } = yield call(request, { url });
      if (code === 0) {
        yield put({ type: "setBuildingCount", payload: data });
      } else {
        yield put({ type: "setErrorInfo", error });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  }
};

export default model;

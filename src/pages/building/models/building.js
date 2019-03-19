import { request } from "@/utils/request";

let model = {
  namespace: "building",
  state: {
    data: [], //表格数据
    pageIndex: 1, //当前页
    pageSize: 5, //页尺寸
    total: 0, //总记录数
    entity: {}, //当前编辑对象
    districtList: [], //小区下拉数据
    isLoading: true, //加载中标志
    showEditModal: false, //显示模态框
    errorInfo: "", //错误信息
    entity: {
      //当前操作对象
      id: "",
      districtId: "",
      name: "",
      no: "",
      state: 1,
      createTime: "",
      modifyTime: ""
    }
  },
  reducers: {
    /**
     * @description 设置当前实体对象
     */
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
     */
    clearEntity(state, action) {
      return {
        ...state,
        entity: {
          //当前操作对象
          id: "",
          districtId: "",
          no: "",
          state: 1,
          createTime: "",
          modifyTime: ""
        }
      };
    },
    /**
     * @description 更新打开/关闭模态框状态
     * @param {Object} state
     * @param {Object} action
     */
    toggleShowModal(state, action) {
      return {
        ...state,
        showEditModal: action.payload
      };
    },
    /**
     * @description 更新当前页数据
     * @param {Object} state
     * @param {Object} action
     */
    loadBuildingData(state, action) {
      return {
        ...state,
        pageIndex: action.payload.pageIndex,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
        data: [...action.payload.data]
      };
    },
    /**
     * @description 更新读取状态
     * @param {Object} state
     * @param {Object} action
     */
    toggleLoadingState(state, action) {
      return {
        ...state,
        isLoading: action.payload
      };
    },
    /**
     * @description 更新小区下拉数据
     * @param {Object} state
     * @param {Object} action
     */
    setDistrictList(state, action) {
      return {
        ...state,
        districtList: action.payload
      };
    },
    /**
     * @description 错误信息
     * @param {Object} state
     * @param {Object} action
     */
    setErrorInfo(state, action) {
      return {
        ...state,
        errorInfo: action.payload
      };
    }
  },
  effects: {
    /**
     * @description 查询楼宇表格数据
     */
    *queryBuildingData({ payload }, { call, put }) {
      let { pageIndex = 1, pageSize = 5 } = payload;
      const url = `building/${pageSize}/${pageIndex}`;
      yield put({ type: "toggleLoadingState", payload: true });
      let { code, data, total, error } = yield call(request, {
        url,
        method: "post",
        data: payload
      });
      if (code === 0) {
        yield put({
          type: "loadBuildingData",
          payload: { pageIndex, pageSize, total, data }
        });
        yield put({ type: "toggleLoadingState", payload: false });
      } else {
        yield put({
          type: "setErrorInfo",
          payload: error.message
        });
      }
      yield put({ type: "toggleLoadingState", payload: false });
    },
    /**
     * @description 查询小区下拉数据
     * @param {Object} param0 Action
     * @param {Object} param1 Effects
     */
    *queryDistrictByKeywords({ payload }, { call, put }) {
      const url = `district/name?keywords=${payload}`;
      let { code, data, error } = yield call(request, {
        url
      });
      if (code === 0) {
        yield put({ type: "setDistrictList", payload: data });
      } else {
        yield put({ type: "setErrorInfo", payload: error });
      }
    },
    /**
     * @description 保存楼宇数据
     * @param {Object} param0 Action
     * @param {Object} param1 Effects
     */
    *saveBuildingData({ payload }, { call, put }) {
      const url = "building";
      if (payload.id) {
        //编辑
        let { code, error } = yield call(request, {
          url,
          method: "put",
          data: payload
        });
        if (code === 0) {
          yield put({ type: "queryBuildingData", payload: {} });
          yield put({ type: "clearEntity" });
          yield put({ type: "toggleShowModal", payload: false });
        } else {
          yield put({ type: "setErrorInfo", payload: error });
        }
      } else {
        let { code, error } = yield call(request, {
          url,
          method: "post",
          data: payload
        });
        if (code === 0) {
          yield put({ type: "queryBuildingData", payload: {} });
          yield put({ type: "toggleShowModal", payload: false });
        } else {
          yield put({ type: "setErrorInfo", payload: error });
        }
      }
    },
    /**
     * @description 按id查询楼宇数据
     * @param {Object} param0 Action
     * @param {Object} param1 Effects
     */
    *queryBuildingById({ payload }, { call, put }) {
      const url = `building/${payload}`;
      const { code, data, error } = yield call(request, {
        url
      });
      if (code === 0) {
        yield put({ type: "setEntity", payload: data });
      } else {
        yield put({ tupe: "setErrorInfo", payload: error });
      }
    },
    /**
     * @description 删除楼宇数据
     */
    *deleteBuildingData({ payload }, { call, put }) {
      const url = `building/${payload}`;
      let { code, data, error } = yield call(request, {
        url,
        method: "delete"
      });
      if (code === 0) {
        yield put({ type: "queryBuildingData", payload: {} });
      } else {
        yield put({ tupe: "setErrorInfo", payload: error });
      }
    }
  },
  subscriptions: {}
};

export default model;

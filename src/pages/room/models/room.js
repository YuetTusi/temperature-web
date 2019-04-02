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
    errorMessage: null
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
    }
  }
};
export default model;

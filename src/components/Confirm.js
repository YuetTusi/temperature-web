import { Modal } from "antd";
const confirm = Modal.confirm;

/**
 * @description 显示询问框
 * @param {String} title 标题
 * @param {String} content 问题
 * @param {Function} onOk yes回调
 * @param {Function} onCancel No回调
 */
function showConfirm(
  title = "询问",
  content = "",
  onOk = () => {},
  onCancel = () => {}
) {
  confirm({
    okText: "是",
    cancelText: "否",
    title,
    content,
    onOk,
    onCancel
  });
}

export { showConfirm };

/**
 * @description 网站标题
 * @param {Object} props
 */
function WebHeader(props) {
  return (
    <div className="web-header">
      <img className="logo" />
      <span className="web-title">{props.title}</span>
      <div className="current-user">
        <label>欢迎您：</label>
        <a>新用户</a>
      </div>
    </div>
  );
}

export default WebHeader;

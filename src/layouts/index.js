import React, { Component, Fragment } from "react";
import { Layout } from "antd";
import LeftMenu from "@/components/LeftMenu";
import WebHeader from "@/components/WebHeader";
const { Header, Footer, Content, Sider } = Layout;

/**
 * @description 总布局页
 */
class CommonLayout extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Fragment>
        <Layout>
          <Header>
            <WebHeader title="室内用户测温系统" />
          </Header>
          <Content>
            <Layout>
              <Sider>
                <LeftMenu />
              </Sider>
              <Content>
                <Layout style={{ padding: "0 24px 24px" }}>
                  <Content>{this.props.children}</Content>
                </Layout>
              </Content>
            </Layout>
          </Content>
          <Footer className="copyright">
            <div>&copy; 2018-2019 石化盈科版权所有</div>
          </Footer>
        </Layout>
      </Fragment>
    );
  }
}

export default CommonLayout;

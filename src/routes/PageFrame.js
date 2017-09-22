import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'dva';

// antd 组件
import { Layout, Menu, Icon, Button } from 'antd';

// 滚动条
import * as Ps from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';

// 加载进度条
import NProgress from 'nprogress';
import styles from './PageFrame.less';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

let lastHref;

class PageFrame extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this);

    // 获取窗口尺寸
    const client = document.documentElement.getBoundingClientRect();

    this.state = {
      mainMenuHeight: client.height - 142,
    };
  }

  componentDidMount() {
    const el = findDOMNode(this);
    const container = document.querySelector('#PS-menu');

    Ps.initialize(container, {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20,
    });
  }

  componentDidUpdate() {
    const container = document.querySelector('#PS-menu');
    Ps.update(container);
  }

  render() {
    // console.log(this);
    if (typeof window !== 'undefined') {
      const href = window.location.href;

      if (lastHref !== href) {
        NProgress.start();
        if (!this.props.loading.global) {
          NProgress.done();
          lastHref = href;
        }
      }
    }

    return (
      <Layout>
        <Sider className={this.props.pagedate.collapsed ? styles.siderFold : styles.siderUnfold}>
          <div className={styles.siderLogo}>
            <img src="../assets/img/brand/logo.png" alt="logo" width="45" height="45" />
          </div>
          <div className={styles.siderMenuBox} id="PS-menu" style={{ height: this.state.mainMenuHeight }}>
            <div>
              <Sider>
                <Menu
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                  inlineCollapsed={this.props.pagedate.collapsed}
                >
                  <Menu.Item key="1">
                    <Icon type="pie-chart" />
                    <span>Option 1</span>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Icon type="desktop" />
                    <span>Option 2</span>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Icon type="inbox" />
                    <span>Option 3</span>
                  </Menu.Item>
                </Menu>
              </Sider>
            </div>
          </div>
          <div className={styles.collapse}>
            <Button type="primary" onClick={this.props.toggleCollapsed} style={{ marginBottom: 16 }}>
              <Icon type={this.props.pagedate.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </Button>
          </div>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content>
            <Layout>
              <Sider breakpoint="md" collapsedWidth="0" onCollapse={(collapsed, type) => { console.log(collapsed, type); }}>
                <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline">
                  <Menu.Item key="1">
                    <Icon type="pie-chart" />
                    <span>Option 1</span>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Icon type="desktop" />
                    <span>Option 2</span>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Icon type="inbox" />
                    <span>Option 3</span>
                  </Menu.Item>
                  <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
                    <Menu.Item key="7">Option 7</Menu.Item>
                    <Menu.Item key="8">Option 8</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                    <Menu.Item key="9">Option 9</Menu.Item>
                    <Menu.Item key="10">Option 10</Menu.Item>
                    <SubMenu key="sub3" title="Submenu">
                      <Menu.Item key="11">Option 11</Menu.Item>
                      <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                  </SubMenu>
                </Menu>
              </Sider>
              <Layout>{this.props.children}</Layout>
            </Layout>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    toggleCollapsed: () => {
      dispatch({
        type: 'pageframe/toggleCollapsed',
      });
    },
  };
}

function mapStateToProps(state, ownProps) {
  // console.log(state);
  return {
    loading: state.loading,
    pagedate: state.pageframe,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageFrame);

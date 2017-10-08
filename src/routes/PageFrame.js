import React from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'dva/router';
import { connect } from 'dva';
import cs from 'classnames';
import update from 'immutability-helper';

// antd 组件
import { Layout, Menu, Icon, Dropdown, Button, Input, Select, Pagination } from 'antd';

// 滚动条
import * as Ps from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';

// 加载进度条
import NProgress from 'nprogress';
import styles from './PageFrame.less';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const ItemGroup = Menu.ItemGroup;
const InputGroup = Input.Group;
const Option = Select.Option;

// 页内变量
let lastHref;
let resizeTime = null;

class PageFrame extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this);
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      const mainmenu = document.querySelector('#PS-mainmenu');

      // 初始化完美滚动条（使用的原因是不想背景截断）
      Ps.initialize(mainmenu, { wheelSpeed: 0.2 });

      // 监听窗口变化，更新完美滚动条
      window.onresize = () => {
        clearTimeout(resizeTime);
        resizeTime = setTimeout(() => {
          clearTimeout(resizeTime);
          Ps.update(mainmenu);
          resizeTime = null;
        }, 300);
      };
    }
  }

  componentDidUpdate() {
    // 更新完美滚动条
    if (typeof window !== 'undefined') {
      Ps.update(document.querySelector('#PS-mainmenu'));
    }
  }

  render() {
    // console.log(this);
    // if (typeof window !== 'undefined') {
    //   const href = window.location.href;

    //   if (lastHref !== href) {
    //     NProgress.start();
    //     if (!this.props.loading.global) {
    //       NProgress.done();
    //       lastHref = href;
    //     }
    //   }
    // }

    return (
      <Layout style={{ height: '100%' }} className={cs(this.props.pagedata.mainSiderCollapsed ? 'mainSiderFold' : 'mainSiderOpen', this.props.pagedata.subSiderCollapsed ? 'subSiderFold' : 'subSiderOpen', this.props.pagedata.submenu ? 'subSiderHave' : 'subSiderNone')}>
        <Sider className={styles.mainSider} width={160} collapsedWidth={80} collapsible collapsed={this.props.pagedata.mainSiderCollapsed} onCollapse={this.props.toggleMainSiderCollapsed}>
          <Layout style={{ height: '100%' }}>
            <Header><img className="logo" src="/assets/img/brand/logo.png" alt="logo" width="50" height="50" /></Header>
            <Content id="PS-mainmenu" style={{ position: 'relative', height: '100%' }}>
              <Menu selectedKeys={this.props.pagedata.menuSelect.main} mode="inline">
                {this.props.pagedata.mainmenu.map((item, key) => {
                  return (
                    <Menu.Item key={item.id}>
                      <Link to={`/${this.props.locale}${item.link}`} className={cs(item.submenu ? 'hasSubMenu' : 'notSubMenu')}>
                        <i className="anticon" style={{ backgroundImage: `url(${item.icon})` }} />
                        <span>{item.name}</span>
                      </Link>
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Content>
            <Footer />
          </Layout>
        </Sider>
        {(this.props.pagedata.submenu) ?
          <Sider className={styles.subSider} collapsedWidth={0} collapsible collapsed={this.props.pagedata.subSiderCollapsed} onCollapse={this.props.toggleSubSiderCollapsed}>
            <Layout style={{ height: '100%' }}>
              <Header><div className="mainMenuTitle">{this.props.pagedata.pageTitle}</div></Header>
              <Content style={{ height: '100%', overflowY: 'auto' }}>
                <Menu mode="inline" selectedKeys={this.props.pagedata.menuSelect.sub} openKeys={this.props.pagedata.menuSelect.open} onOpenChange={this.props.submenuChange}>
                  {this.props.pagedata.submenu.map((item, key) => {
                    if (item.submenu) {
                      return (
                        <SubMenu key={item.id} title={<span>{item.name}</span>}>
                          {item.submenu.map((subitem, subkey) => <Menu.Item key={subitem.id}>
                            <Link to={`/${this.props.locale}${item.link}`}>
                              <i className="anticon" />
                              <span>{subitem.name}</span>
                            </Link>
                          </Menu.Item>)}
                        </SubMenu>
                      );
                    } else {
                      return (
                        <Menu.Item key={item.id}>
                          <Link to={`/${this.props.locale}${item.link}`}>
                            <i className="anticon" />
                            <span>{item.name}</span>
                          </Link>
                        </Menu.Item>
                      );
                    }
                  })}
                </Menu>
              </Content>
            </Layout>
          </Sider>
        : null}
        {this.props.children}
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    toggleMainSiderCollapsed: (collapsed) => {
      dispatch({
        type: 'pageframe/toggleMainSiderCollapsed',
        payload: collapsed,
      });
    },
    toggleSubSiderCollapsed: (collapsed) => {
      console.log(collapsed);
      dispatch({
        type: 'pageframe/toggleSubSiderCollapsed',
        payload: collapsed,
      });
    },
    submenuChange: (openKeys) => {
      console.log(openKeys);
      dispatch({
        type: 'pageframe/submenuChange',
        payload: openKeys,
      });
    },
  };
}

function mapStateToProps(state, ownProps) {
  // console.log(state);
  return {
    pagedata: state.pageframe,
    loading: state.loading,
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageFrame);

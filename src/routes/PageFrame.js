import React from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'dva/router';
import { connect } from 'dva';
import cs from 'classnames';

// antd 组件
import { Layout, Menu, Icon, Button, Input, Select, Pagination } from 'antd';

// 滚动条
import * as Ps from 'perfect-scrollbar';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';

// 加载进度条
import NProgress from 'nprogress';
import styles from './PageFrame.less';

// antd 组件扩展
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const InputGroup = Input.Group;
const Option = Select.Option;

let lastHref;

class PageFrame extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this);

    // 获取窗口尺寸
    const client = document.documentElement.getBoundingClientRect();

    this.state = {
      mainMenuHeight: client.height - 142,
      contentHeight: client.height - 64,
    };
  }

  componentDidMount() {
    const menu = document.querySelector('#PS-menu');
    const submenu = document.querySelector('#PS-submenu');

    Ps.initialize(menu, {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20,
    });

    if (submenu) {
      Ps.initialize(submenu, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }
  }

  componentDidUpdate() {
    const menu = document.querySelector('#PS-menu');
    const submenu = document.querySelector('#PS-submenu');

    Ps.update(menu);

    if (submenu) {
      try {
        Ps.update(submenu);
      } catch (e) {
        if (submenu) {
          Ps.initialize(submenu, {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 20,
          });
        } else {
          Ps.destroy(submenu);
        }
      }
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

    const mainMenuComponent = this.props.pagedate.mainmenu.map((item, key) => {
      return (
        <Menu.Item key={key}>
          <i style={{ backgroundImage: `url(${item.icon})` }} />
          <Link to={`/${this.props.locale}${item.href}`} className={cs(item.submenu ? 'hasSubMenu' : 'notSubMenu')}>{item.name}</Link>
        </Menu.Item>
      );
    });

    let subMenuComponent = null;

    if (this.props.pagedate.submenu) {
      subMenuComponent = this.props.pagedate.submenu.map((item, key) => {
        let menulist = null;

        if (item.submenu) {
          menulist = (
            <SubMenu key={key} title={<span><span>{item.name}</span></span>}>
              {item.submenu.map((subitem, subkey) => <Menu.Item key={(key * subkey) + 1}><Link to={`/${this.props.locale}${item.href}`}>{subitem.name}</Link></Menu.Item>)}
            </SubMenu>
          );
        } else {
          menulist = (
            <Menu.Item key={key}>
              <Link to={`/${this.props.locale}${item.href}`}>{item.name}</Link>
            </Menu.Item>
          );
        }

        return menulist;
      });
    }

    const { userName } = this.state;
    const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;

    return (
      <Layout>
        <Sider className={cs(styles.mainSider, this.props.pagedate.collapsed ? 'fold' : 'unfold')}>
          <div className="logo"><img src="../assets/img/brand/logo.png" alt="logo" width="50" height="50" /></div>
          <div id="PS-menu" style={{ position: 'relative', height: this.state.mainMenuHeight }}>
            <Menu defaultSelectedKeys={['0']} defaultOpenKeys={['0']} mode="inline" inlineCollapsed={this.props.pagedate.collapsed}>
              {mainMenuComponent}
            </Menu>
          </div>
          <div className="collapse" onClick={this.props.toggleCollapsed}><i /><div>收缩</div></div>
        </Sider>
        <Layout style={{ overflow: 'hidden' }}>
          <Header className={styles.mainHeader}>
            <Layout>
              <Sider className="headerSide">
                <div className="icon" onClick={this.props.toggleSubCollapsed} />
                <div className="title">{this.props.pagedate.pageTitle}</div>
              </Sider>
              <Content>
                <div className="search">
                  <InputGroup compact>
                    <Select defaultValue="Zhejiang">
                      <Option value="Zhejiang">设备号</Option>
                      <Option value="Jiangsu">维护人员</Option>
                    </Select>
                    <Input
                      style={{ width: '240px' }}
                      placeholder="搜索设备..."
                      onPressEnter={(e) => {
                        console.log(e.target.value);
                        return 1;
                      }}
                    />
                  </InputGroup>
                </div>
                <div className="operate">&emsp;&emsp;新增设备&emsp;&ensp;导出Excel</div>
                <div className="pagination"></div>
              </Content>
            </Layout>
          </Header>
          <Content>
            <Layout>
              {(subMenuComponent) ?
                <Sider className={cs(styles.subSider, this.props.pagedate.subcollapsed ? 'fold' : 'unfold')}>
                  <div id="PS-submenu" style={{ position: 'relative', height: this.state.contentHeight }}>
                    <Menu defaultSelectedKeys={['0']} defaultOpenKeys={['0']} mode="inline">
                      {subMenuComponent}
                    </Menu>
                  </div>
                </Sider>
              : null}
              <Content id="PS-content" style={{ position: 'relative', overflow: 'auto', height: this.state.contentHeight }}>{this.props.children}</Content>
            </Layout>
          </Content>
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
    toggleSubCollapsed: () => {
      dispatch({
        type: 'pageframe/toggleSubCollapsed',
      });
    },
  };
}

function mapStateToProps(state, ownProps) {
  // console.log(state);
  return {
    loading: state.loading,
    pagedate: state.pageframe,
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageFrame);

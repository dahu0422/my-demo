/**
 * 设计器命名空间
 */
declare namespace Design {
  /**
   * 组件配置接口
   * @interface ComponentConfig
   * @property {string} category - 组件分类
   * @property {string} name - 组件名称
   * @property {string} desc - 组件描述
   * @property {string} path - 组件路径
   * @property {string} navigation - 导航标识
   * @property {string} thumbnail - 组件缩略图
   */
  interface ComponentConfig {
    category: string;
    name: string;
    desc: string;
    path: string;
    navigation: string;
    thumbnail: string;
  }

  /**
   * 导航配置接口
   * @interface Navigation
   * @property {string} key - 导航唯一标识
   * @property {string} name - 导航名称
   */
  interface Navigation {
    [key: string]: {
      key: string;
      name: string;
    };
  }

  /**
   * 设计器状态存储接口
   * @interface Store
   * @property {Navigation[]} [navigations] - 导航列表
   * @property {ComponentConfig[]} [componentList] - 组件列表
   */
  interface Store {
    componentList: ComponentConfig[];
    navigations: Navigation;
  }
}

/**
 * 扩展全局 Window 接口
 * @interface Window
 * @property {Design.Store} designStore - 设计器状态存储
 */
interface Window {
  designStore: Design.Store;
}
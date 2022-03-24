import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,Container,Header,Main,Aside} from 'element-ui'
import {Menu,Submenu,MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem} from 'element-ui'
import {Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog} from 'element-ui'
import {MessageBox,Tag,Tree,Select,Option,Cascader,Alert,TabPane,Tabs,Steps,Step} from 'element-ui'
import {Checkbox,CheckboxGroup,Upload} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)

// 全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
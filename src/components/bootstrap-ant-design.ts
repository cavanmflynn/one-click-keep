import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Icon,
  Layout,
  Menu,
  Modal,
  Result,
  Row,
  notification,
  Table,
  PageHeader,
  Form,
  Divider,
  Input,
  InputNumber,
  message,
  Tag,
  Statistic,
  Tooltip,
  Dropdown,
  Drawer,
} from 'ant-design-vue';
import Vue from 'vue';

Vue.use(Avatar);
Vue.use(Badge);
Vue.use(Button);
Vue.use(Card);
Vue.use(Col);
Vue.use(Divider);
Vue.use(Drawer);
Vue.use(Dropdown);
Vue.use(Form);
Vue.use(Icon);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Modal);
Vue.use(PageHeader);
Vue.use(Result);
Vue.use(Row);
Vue.use(Statistic);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Tooltip);

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = message;

notification.config({
  placement: 'bottomRight',
  bottom: '50px',
  duration: 5,
});

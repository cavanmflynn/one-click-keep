import { Component, Vue } from 'vue-property-decorator';
import WithRender from './about.html';

@WithRender
@Component
export default class About extends Vue {}

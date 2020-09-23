import { Component, Vue } from 'vue-property-decorator';
import WithRender from './nav-bar.html';

@WithRender
@Component
export class NavBar extends Vue {}

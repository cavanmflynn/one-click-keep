import { Component, Vue } from 'vue-property-decorator';
import WithRender from './get-started.html';

@WithRender
@Component
export class GetStarted extends Vue {}

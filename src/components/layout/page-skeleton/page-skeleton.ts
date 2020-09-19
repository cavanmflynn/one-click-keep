import { Component, Vue } from 'vue-property-decorator';
import WithRender from './page-skeleton.html';

@WithRender
@Component
export class PageSkeleton extends Vue {}

import { system } from '@/store';
import { Component, Vue, Watch } from 'vue-property-decorator';
import WithRender from './detect-docker-modal.html';
import { Platform } from '@/types';
import { getPlatform, openInBrowser } from '@/lib/utils';

@WithRender
@Component
export class DetectDockerModal extends Vue {
  public dockerLinks: Record<Platform, Record<string, string>> = {
    mac: {
      'Docker Desktop': 'https://docs.docker.com/docker-for-mac/install/',
    },
    windows: {
      'Docker Desktop': 'https://docs.docker.com/docker-for-windows/install/',
    },
    linux: {
      Docker: 'https://docs.docker.com/install/#server',
      'Docker Compose': 'https://docs.docker.com/compose/install/',
    },
    unknown: {},
  };
  public buttonIcons: Record<Platform, string> = {
    mac: 'apple',
    windows: 'windows',
    linux: 'download',
    unknown: 'download',
  };
  public detailColumns = [
    {
      title: 'Tool',
      dataIndex: 'tool',
    },
    {
      title: 'Version',
      dataIndex: 'version',
    },
  ];
  public details = [
    {
      key: 'docker',
      tool: 'Docker',
      version: this.docker || this.$lang.translate('NOT_FOUND'),
    },
    {
      key: 'docker-compose',
      tool: 'Docker Compose',
      version: this.compose || this.$lang.translate('NOT_FOUND'),
    },
  ];

  get platform() {
    return getPlatform();
  }

  get docker() {
    return system.dockerVersions.docker;
  }

  get compose() {
    return system.dockerVersions.compose;
  }

  @Watch('docker', { immediate: true })
  updateDockerVersion(version: string | undefined) {
    if (version) {
      Vue.set(this.details[0], 'version', version);
    }
  }

  @Watch('compose', { immediate: true })
  updateDockerComposeVersion(version: string | undefined) {
    if (version) {
      Vue.set(this.details[1], 'version', version);
    }
  }

  /**
   * Populate the docker versions or throw
   */
  public async checkDockerVersions() {
    try {
      await system.getDockerVersions(true);
    } catch (error) {
      system.notify({ message: this.$lang.translate('DOCKER_ERROR'), error });
    }
  }

  /**
   * Open the passed URL in the browser
   * @param url The URL to open
   */
  public openInBrowser(url: string) {
    openInBrowser(url);
  }
}

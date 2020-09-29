// Import all supported locales
import 'dayjs/locale/en';

import { LANGUAGE_TO_LOCALE } from '@/localization';
import {
  ValidLanguage,
  DockerVersions,
  NotificationConfig,
  DockerRepoState,
} from '@/types';
import dayjs from 'dayjs';
import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators';
import { store } from '../store';
import { docker } from '@/lib/docker/docker-service';
import { notification } from 'ant-design-vue';
import { warn } from 'electron-log';
import { DEFAULT_REPO_STATE } from '@/lib/constants';
import { network, bitcoind } from '..';
import router from '../../router';

@Module({ store, name: 'system', dynamic: true, namespaced: true })
export class SystemModule extends VuexModule {
  private _initialized = false;
  private _language: ValidLanguage = 'en';
  private _dockerVersions: DockerVersions = {
    docker: '',
    compose: '',
  };
  private _dockerImages: string[] = [];
  private _dockerRepoState: DockerRepoState = DEFAULT_REPO_STATE;

  public get initialized() {
    return this._initialized;
  }

  public get language() {
    return this._language;
  }

  public get dockerVersions() {
    return this._dockerVersions;
  }

  public get dockerImages() {
    return this._dockerImages;
  }

  public get dockerRepoState() {
    return this._dockerRepoState;
  }

  @Mutation
  public setInitialized(initialized: boolean) {
    this._initialized = initialized;
  }

  @Mutation
  public setLanguage(language: ValidLanguage) {
    dayjs.locale(LANGUAGE_TO_LOCALE[language]);
    this._language = language;
  }

  @Mutation
  public setDockerVersions(dockerVersions: DockerVersions) {
    this._dockerVersions = dockerVersions;
  }

  @Mutation
  public setDockerImages(dockerImages: string[]) {
    this._dockerImages = dockerImages;
  }

  @Mutation
  public setDockerRepoState(dockerRepoState: DockerRepoState) {
    this._dockerRepoState = dockerRepoState;
  }

  @Action({ rawError: true })
  public async initialize() {
    await network.load();
    await this.getDockerVersions(false);
    await this.getDockerImages();
    this.setInitialized(true);
  }

  @Action({ rawError: true })
  public async getDockerVersions(throwOnError: boolean) {
    const versions = await docker.getVersions(throwOnError);
    this.setDockerVersions(versions);
  }

  @Action({ rawError: true })
  public async getDockerImages() {
    const images = await docker.getImages();
    this.setDockerImages(images);
  }

  @Action({ rawError: true })
  public notify({ message, description, error }: NotificationConfig) {
    if (error) {
      notification.error({
        duration: 8,
        message,
        description: description || error.message,
      });
      warn(message, error);
    } else {
      notification.success({
        message,
        description: description ?? '',
      });
    }
  }

  @Action({ rawError: true })
  public navigateToNetwork(id: string | number) {
    bitcoind.clearNodes();
    router.push({
      name: 'network-view',
      params: {
        id: id.toString(),
      },
    });
  }
}

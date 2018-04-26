import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiConfig
} from 'ng-gapi';

import { environment } from '../environments/environment';

export const gapiClientConfig: NgGapiClientConfig = {
  client_id: environment.gapiClientId,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  scope: [
    'https://www.googleapis.com/auth/drive',
  ].join(' ')
};

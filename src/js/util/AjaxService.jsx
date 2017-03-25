import AuthService from 'util/AuthService';


class AjaxService {
  constructor() {
    this.url = (process.env.NODE_ENV === 'production') ? `${location.origin}/api` : 'https://dev.calligre.com/api';
  }

  getUrl() {
    return this.url;
  }

  /*
    Makes a get call
      param: endpoint - hits api/endpoint
      param: success - call back for status 2xx
      param: error - call back for all non successful statuses
  */
  get(options) {
    const { endpoint, success, error } = options;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.url}/${endpoint}`);
    xhr.setRequestHeader('Authorization', `Bearer ${AuthService.getToken()}`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        success(response);
      } else {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        error.call(response, xhr.status);
      }
    };
    xhr.send();
  }

  /*
    Makes a patch call
      param: endpoint - hits api/endpoint/data.id
      param: data - values to update to
      param: success - call back for status 2xx
      param: error - call back for all non successful statuses
  */
  update(options) {
    const { endpoint, success, error, data } = options;
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `${this.url}/${endpoint}/${data.id || ''}`);
    xhr.setRequestHeader('Authorization', `Bearer ${AuthService.getToken()}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        success(response);
      } else {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        error(response, xhr.status);
      }
    };
    xhr.send(JSON.stringify(data));
  }

  /*
    Makes a post call
      param: endpoint - hits api/endpoint
      param: data - values to create with
      param: success - call back for status 2xx
      param: error - call back for all non successful statuses
  */
  create(options) {
    const { endpoint, success, error, data } = options;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.url}/${endpoint}`);
    xhr.setRequestHeader('Authorization', `Bearer ${AuthService.getToken()}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        success(response);
      } else {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        error(response, xhr.status);
      }
    };
    xhr.send(JSON.stringify(data));
  }

  /*
    Makes a delete call
      param: endpoint - hits api/endpoint/id
      param: id - id of element to be deleted
      param: success - call back for status 2xx
      param: error - call back for all non successful statuses
  */
  delete(options) {
    const { endpoint, success, error, id } = options;
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${this.url}/${endpoint}/${id}`);
    xhr.setRequestHeader('Authorization', `Bearer ${AuthService.getToken()}`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        success(response);
      } else {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        error(response, xhr.status);
      }
    };
    xhr.send();
  }
  /*
    Makes a generic call
      param: url - hits url
      param: endpoint - hits api/endpoint/id
      param: type - type of the call being made (HTTP verb)
      param: data - params being passed with call
      param: contentType - passed as Content-Type header
      param: noAuth - stops passing of Authorization header
      param: success - call back for status 2xx
      param: error - call back for all non successful statuses
  */
  call(options) {
    const { url, endpoint, type, data, contentType, noAuth, success, error } = options;
    const xhr = new XMLHttpRequest();
    const path = url || `${this.url}/${endpoint}`;
    xhr.open(type, path);
    if (!noAuth) {
      xhr.setRequestHeader('Authorization', `Bearer ${AuthService.getToken()}`);
    }
    xhr.setRequestHeader('Content-Type', contentType || 'application/json');

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        success(response);
      } else {
        const response = (xhr.response) ? JSON.parse(xhr.response) : {};
        error(response, xhr.status);
      }
    };

    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  }

}


const ajaxService = new AjaxService();
export default ajaxService;

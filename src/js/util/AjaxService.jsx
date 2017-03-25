import AuthService from 'util/AuthService';


class AjaxService {
  constructor() {
    this.url = (process.env.NODE_ENV === 'production') ? `${location.origin}/api` : 'https://dev.calligre.com/api';
  }

  getUrl() {
    return this.url;
  }

  // data type, cache
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

  // processdata: false, datatype: json
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

  // processdata: false, datatype: json
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

  // processdata: false, datatype: json
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


  // processdata: false, datatype: json
  call(options) {
    const { url, endpoint, type, data, contentType, success, error} = options;
    const xhr = new XMLHttpRequest();
    const path = url || `${this.url}/${endpoint}`;
    xhr.open(type, path);
    xhr.setRequestHeader('Authorization', `Bearer ${AuthService.getToken()}`);
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

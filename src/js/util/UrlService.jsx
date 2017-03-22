class UrlService {
  constructor() {
    this.url = (process.env.NODE_ENV === 'debug') ? 'https://dev.calligre.com/api' : location.origin + '/api';
  }

  getUrl() {
    return this.url;
  }
}


const urlService = new UrlService();
export default urlService;

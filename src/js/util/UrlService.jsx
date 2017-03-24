class UrlService {
  constructor() {
    this.url = (process.env.NODE_ENV === 'production') ? `${location.origin}/api` : 'https://dev.calligre.com/api';
  }

  getUrl() {
    return this.url;
  }
}


const urlService = new UrlService();
export default urlService;

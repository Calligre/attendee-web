import { EventEmitter } from 'events';
import AuthService from 'util/AuthService';
import UrlService from 'util/UrlService';

import dispatcher from 'dispatcher';

const $ = require('jquery');

const url = UrlService.getUrl();


class SurveyStore extends EventEmitter {
  constructor() {
    super();
    this.surveys = [];
    this.error = null;
  }

  getAll() {
    $.ajax({
      url: `${url}/survey`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'SURVEYS_GET', surveys: response.data });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'SURVEYS_ERROR', error: error.error });
      },
    });
    return this.surveys;
  }

  create(survey) {
    $.ajax({
      url: `${url}/survey`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      type: 'POST',
      contentType: 'application/json',
      data : JSON.stringify(survey),
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'SURVEYS_CREATE', survey: survey, id: response.data.id });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'SURVEYS_ERROR', error: error.error });
      },
    });
    return this.surveys;
  }

  update(survey) {
    $.ajax({
      url: `${url}/survey/${survey.id}`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      type: 'PATCH',
      contentType: 'application/json',
      data : JSON.stringify(survey),
      cache: false,
      success(response) {
        dispatcher.dispatch({ type: 'SURVEYS_UPDATE', survey: survey });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'SURVEYS_ERROR', error: error.error });
      },
    });
    return this.surveys;
  }

  delete(id) {
    $.ajax({
      url: `${url}/survey/${id}`,
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
      processData: false,
      type: 'DELETE',
      contentType: 'application/json',
      cache: false,
      success() {
        dispatcher.dispatch({ type: 'SURVEYS_DELETE', id: id });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'SURVEYS_ERROR', error: error.error });
      },
    });
    return this.surveys;
  }

  handleActions(action) {
    switch (action.type) {
      case 'SURVEYS_GET': {
        this.surveys = [];
        action.surveys.forEach(survey => this.surveys.push(survey.attributes));
        this.emit('loaded');
        break;
      }
      case 'SURVEYS_UPDATE': {
        this.surveys.forEach((survey) => {
          if (survey.id === action.survey.id) {
            $.extend(survey, action.survey);
          }
        });
        this.emit('updated');
        break;
      }
      case 'SURVEYS_CREATE': {
        const survey = action.survey;
        survey.id = action.id;
        this.surveys.push(survey);
        this.emit('created');
        break;
      }
      case 'SURVEYS_DELETE': {
        const index = this.surveys.findIndex(survey => survey.id === action.id);
        delete this.surveys[index];

        this.emit('deleted');
        break;
      }
      case 'ERROR': {
        this.error = action.error;
        this.emit('error');
        break;
      }
      default: {
        break;
      }
    }
  }


}


const surveyStore = new SurveyStore();
dispatcher.register(surveyStore.handleActions.bind(surveyStore));

export default surveyStore;

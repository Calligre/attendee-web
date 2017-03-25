import { EventEmitter } from 'events';
import AjaxService from 'util/AjaxService';

import dispatcher from 'dispatcher';


class SurveyStore extends EventEmitter {
  constructor() {
    super();
    this.surveys = [];
    this.error = null;
  }

  getAll() {
    AjaxService.get({
      endpoint: 'survey',
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
    AjaxService.create({
      endpoint: 'survey',
      data: survey,
      success(response) {
        dispatcher.dispatch({ type: 'SURVEYS_CREATE', survey, id: response.data.id });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'SURVEYS_ERROR', error: error.error });
      },
    });
    return this.surveys;
  }

  update(survey) {
    AjaxService.update({
      endpoint: 'survey',
      data: survey,
      success() {
        dispatcher.dispatch({ type: 'SURVEYS_UPDATE', survey });
      },
      failure(error) {
        dispatcher.dispatch({ type: 'SURVEYS_ERROR', error: error.error });
      },
    });
    return this.surveys;
  }

  delete(id) {
    AjaxService.delete({
      endpoint: 'survey',
      id,
      success() {
        dispatcher.dispatch({ type: 'SURVEYS_DELETE', id });
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
            Object.assign(survey, action.survey);
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

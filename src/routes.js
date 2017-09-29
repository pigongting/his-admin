import React from 'react';
import PageFrame from './routes/PageFrame';

function registerModel(app, model) {
  if (app && !(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model);
  }
}

function Routes(locale, app) {
  return [
    {
      path: `/${locale}/index`,
      component: PageFrame,
      getIndexRoute(nextState, cb) {
        if (process.env.NODE_ENV === 'development') {
          import(/* webpackChunkName: "Index" */ './routes/Index')
          .then((data) => {
            registerModel(app, require('./models/index'));
            cb(null, { component: data });
          })
          .catch(err => console.log('Failed to load Index', err));
        } else {
          registerModel(app, require('./models/index'));
          cb(null, { component: require('./routes/Index') });
        }
      },
      childRoutes: [
        {
          path: `/${locale}/device`,
          getComponent(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "Device" */ './routes/Device')
              .then((data) => {
                registerModel(app, require('./models/device'));
                cb(null, data);
              })
              .catch(err => console.log('Failed to load Device', err));
            } else {
              registerModel(app, require('./models/device'));
              cb(null, require('./routes/Device'));
            }
          },
        },
      ],
    },
  ];
}

export default Routes;

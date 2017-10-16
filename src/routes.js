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
      path: `/${locale}/login`,
      getIndexRoute(nextState, cb) {
        if (process.env.NODE_ENV === 'development') {
          import(/* webpackChunkName: "Login" */ './routes/Login')
          .then((data) => {
            registerModel(app, require('./models/login'));
            cb(null, { component: data });
          })
          .catch(err => console.log('Failed to load Login', err));
        } else {
          registerModel(app, require('./models/login'));
          cb(null, { component: require('./routes/Login') });
        }
      },
    },
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
          path: `/${locale}/mine`,
          getComponent(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "Mine" */ './routes/Mine')
              .then((data) => {
                registerModel(app, require('./models/mine'));
                cb(null, data);
              })
              .catch(err => console.log('Failed to load Mine', err));
            } else {
              registerModel(app, require('./models/mine'));
              cb(null, require('./routes/Mine'));
            }
          },
        },
        {
          path: `/${locale}/device`,
          childRoutes: [
            {
              path: 'list',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "Device/List" */ './routes/Device/List')
                  .then((data) => {
                    registerModel(app, require('./models/device/list'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load Device/List', err));
                } else {
                  registerModel(app, require('./models/device/list'));
                  cb(null, require('./routes/Device/List'));
                }
              },
            },
            {
              path: 'edit',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "Device/Edit" */ './routes/Device/Edit')
                  .then((data) => {
                    registerModel(app, require('./models/device/edit'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load Device/Edit', err));
                } else {
                  registerModel(app, require('./models/device/edit'));
                  cb(null, require('./routes/Device/Edit'));
                }
              },
            },
          ],
        },
        {
          path: `/${locale}/app`,
          childRoutes: [
            {
              path: 'dept',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "App/Dept" */ './routes/App/Dept')
                  .then((data) => {
                    registerModel(app, require('./models/app/dept'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load App/Dept', err));
                } else {
                  registerModel(app, require('./models/app/dept'));
                  cb(null, require('./routes/App/Dept'));
                }
              },
            },
            {
              path: 'doctor',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "App/Doctor" */ './routes/App/Doctor')
                  .then((data) => {
                    registerModel(app, require('./models/app/doctor'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load App/Doctor', err));
                } else {
                  registerModel(app, require('./models/app/doctor'));
                  cb(null, require('./routes/App/Doctor'));
                }
              },
            },
            {
              path: 'doctoredit',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "App/DoctorEdit" */ './routes/App/DoctorEdit')
                  .then((data) => {
                    registerModel(app, require('./models/app/doctoredit'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load App/DoctorEdit', err));
                } else {
                  registerModel(app, require('./models/app/doctoredit'));
                  cb(null, require('./routes/App/DoctorEdit'));
                }
              },
            },
          ],
        },
      ],
    },
  ];
}

export default Routes;

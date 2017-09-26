import React from 'react';
import PageFrame from './routes/PageFrame';
import Content from './routes/Content';

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
          import(/* webpackChunkName: "IndexPage" */ './routes/IndexPage')
          .then((data) => {
            registerModel(app, require('./models/index'));
            cb(null, { component: data });
          })
          .catch(err => console.log('Failed to load IndexPage', err));
        } else {
          registerModel(app, require('./models/index'));
          cb(null, { component: require('./routes/IndexPage') });
        }
      },
      childRoutes: [
        {
          path: `/${locale}/product`,
          getComponent(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "IndexPage" */ './routes/IndexPage')
              .then((data) => {
                registerModel(app, require('./models/index'));
                cb(null, data);
              })
              .catch(err => console.log('Failed to load IndexPage', err));
            } else {
              registerModel(app, require('./models/index'));
              cb(null, require('./routes/IndexPage'));
            }
          },
        },
        {
          path: `/${locale}/device`,
          component: Content,
          getIndexRoute(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "Device/List" */ './routes/Device/List')
              .then((data) => {
                registerModel(app, require('./models/device/list'));
                cb(null, { component: data });
              })
              .catch(err => console.log('Failed to load Device/List', err));
            } else {
              registerModel(app, require('./models/device/list'));
              cb(null, { component: require('./routes/Device/List') });
            }
          },
          childRoutes: [
            {
              path: 'detail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "Device/Detail" */ './routes/Device/Detail')
                  .then((data) => {
                    registerModel(app, require('./models/device/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load Device/Detail', err));
                } else {
                  registerModel(app, require('./models/device/detail'));
                  cb(null, require('./routes/Device/Detail'));
                }
              },
            },
          ],
        },
      ],
    },
    {
      path: `/${locale}/users`,
      component: Content,
      getIndexRoute(nextState, cb) {
        if (process.env.NODE_ENV === 'development') {
          import(/* webpackChunkName: "Users" */ './routes/Users')
          .then((data) => {
            registerModel(app, require('./models/users'));
            cb(null, { component: data });
          })
          .catch(err => console.log('Failed to load Users', err));
        } else {
          registerModel(app, require('./models/users'));
          cb(null, { component: require('./routes/Users') });
        }
      },
      childRoutes: [
        {
          path: 'product',
          getComponent(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "Product" */ './routes/Product')
              .then((data) => {
                registerModel(app, require('./models/users/product'));
                cb(null, data);
              })
              .catch(err => console.log('Failed to load Product', err));
            } else {
              registerModel(app, require('./models/users/product'));
              cb(null, require('./routes/Product'));
            }
          },
        },
      ],
    },
  ];
}

export default Routes;

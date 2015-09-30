'use strict';﻿

define(['plugins/router', 'durandal/app'], function (router, app) {
  return {
    router: router,

    activate: function () {
      router.map([
        { route: ['', 'catalog'], title: 'Catalog', moduleId: 'viewmodels/catalog', nav: true},
        { route: ['about'], title: 'About', moduleId: 'viewmodels/about', nav: true},
        { route: ['cards/:param1*details'], hash: '#cards', title: 'Cards', moduleId: 'viewmodels/cards', nav: false}
      ]).buildNavigationModel();

      return router.activate();
    },

    randomChecked: false,

    randomChanged: function() {
      app.trigger('randomChanged', this.randomChecked);
      return true;
    }
  };
});

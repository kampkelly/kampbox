try {
    window.$ = window.jQuery = require('jquery');
} catch (e) {}
window.Popper = require('popper.js');
require('bootstrap');  //bootstrap


window.axios = require('axios');  //axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

//window.Vue = require('vue');
//window.VueRouter = require('vue-router');


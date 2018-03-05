//import VueRouter from 'vue-router';
//var VueRouter = require('vue-router');
let routes = [
	{
		path: '/',
		component: require('./vue_views/home.vue')
	}, 
	{
		path: '/chatroom/:id',
		component: require('./vue_views/chatrooms/show.vue')
	},
	{
		path: '/user/:username',
		component: require('./vue_views/users/chat.vue')
	},
	{
		path: '/user/:username/profile',
		component: require('./vue_views/users/profile.vue')
	},
	{
		path: '/user/:username/profile/edit',
		component: require('./vue_views/users/edit.vue')
	},
	{
		path: '/search',
		component: require('./vue_views/search.vue')
	},
	{
		path: '/cool',
		component: require('./vue_views/cool.vue')
	}
];

/* export default new VueRouter({
	routes,
	linkActiveClass: 'is-active'
}); */

var routing = new VueRouter({
	routes,
	linkActiveClass: 'is-active'
});


module.exports = routing;
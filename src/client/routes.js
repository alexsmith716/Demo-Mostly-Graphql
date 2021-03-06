import Root from '../containers/Root/Root';
import App from '../containers/App/App';
import Home from '../containers/Home/Home';
import NotFound from '../containers/NotFound/Loadable';

import About from '../containers/About/Loadable';
//  import AboutA from '../containers/AboutAAA/AboutA';
//  import AboutA from '../containers/AboutAAA/Loadable';
import AboutB from '../containers/AboutBBB/Loadable';
import RESTfulExample from '../containers/RESTfulExample/Loadable';
import GraphQLExample from '../containers/GraphQLExample/Loadable';
import GraphiQLExample from '../containers/GraphiQLExample/Loadable';

import { preloadData as preloadDataApp } from '../containers/App/preloadData';
import { preloadData as preloadDataAbout } from '../containers/About/preloadData';

const routes = [
	{
		component: Root,
		path: '/',
		routes: [
			{
				path: '/',
				component: App,
				loadData: preloadDataApp,
				routes: [
					{
						path: '/',
						exact: true,
						component: Home,
					},
					{
						path: '/about',
						exact: true,
						component: About,
						loadData: preloadDataAbout,
					},
					//  {
					//  	path: '/aboutA',
					//  	exact: true,
					//  	component: AboutA,
					//  },
					{
						path: '/aboutB',
						exact: true,
						component: AboutB,
					},
					{
						path: '/restfulexample',
						exact: true,
						component: RESTfulExample,
					},
          {
          	path: '/graphqlexample',
          	exact: true,
          	component: GraphQLExample,
          },
					{
						path: '/graphiqlexample',
						exact: true,
						component: GraphiQLExample,
					},
					{
						path: '*',
						component: NotFound,
					},
				],
			},
		],
	},
];

export default routes;

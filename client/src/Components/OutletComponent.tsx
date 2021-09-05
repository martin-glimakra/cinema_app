/** @format */

import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { BrowserRouter, Switch } from 'react-router-dom';
import { GET } from 'Utils/http';
import authReducer from 'Store/store';

import LoadingComponent from 'Pages/Index/LoadingComponent';
import ErrorComponent from 'Pages/Index/ErrorComponent';
import HomeComponent from 'Pages/Index/HomeComponent';
import BookingComponent from 'Pages/Index/BookingComponent';

import LoginComponent from 'Pages/Admin/LoginComponent';
import DashboardComponent from 'Pages/Admin/DashboardComponent';

const requireLogin = async (to: any, from: any, next: any) => {
	const response = await GET('/api/admin');

	authReducer.dispatch({
		type: 'set',
		payload: {
			loggedIn: response.success,
		},
	});

	// auth does not matter for the requested route
	if (to.meta.auth === undefined) return next();

	// auth must be present on the requested route
	if (to.meta.auth) return response.success ? next() : next.redirect('/');

	// auth must not be present on the requested route
	if (!to.meta.auth)
		return !response.success ? next() : next.redirect('/admin/publish');
};

interface Route {
	path: string;
	component: React.FunctionComponent;
	auth?: boolean;
}

const routes: Route[] = [
	{
		path: '/admin/dashboard',
		component: DashboardComponent,
		auth: true,
	},
	{
		path: '/admin/login',
		component: LoginComponent,
		auth: false,
	},
	{
		path: '/',
		component: HomeComponent,
	},
	{
		path: '/:title/:today',
		component: BookingComponent,
	},
	{
		path: '*',
		component: ErrorComponent,
	},
];

export default function OutletComponent(props: any): JSX.Element {
	return (
		<BrowserRouter>
			<GuardProvider
				guards={[requireLogin]}
				loading={LoadingComponent}
				error={ErrorComponent}>
				<Switch>
					{routes.map((route: Route) => (
						<GuardedRoute
							key={route.path}
							path={route.path}
							component={route.component}
							meta={{ auth: route.auth }}
							exact></GuardedRoute>
					))}
				</Switch>
			</GuardProvider>
		</BrowserRouter>
	);
}

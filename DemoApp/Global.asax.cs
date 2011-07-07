namespace DemoApp
{
	using System;
	using System.Web.Routing;
	using DemoApp.services;
	using Microsoft.ApplicationServer.Http.Activation;

	public class Global : System.Web.HttpApplication
	{
		protected void Application_Start( object sender, EventArgs e )
		{
			var routes = RouteTable.Routes;

			routes.MapServiceRoute<UserResource>( "services/user" );
		}

		protected void Session_Start( object sender, EventArgs e )
		{

		}

		protected void Application_BeginRequest( object sender, EventArgs e )
		{

		}

		protected void Application_AuthenticateRequest( object sender, EventArgs e )
		{

		}

		protected void Application_Error( object sender, EventArgs e )
		{

		}

		protected void Session_End( object sender, EventArgs e )
		{

		}

		protected void Application_End( object sender, EventArgs e )
		{

		}
	}
}
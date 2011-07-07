// Knockout Demo App JavaScript library v1.2.1
// (c) Joe McBride - http://uicraftsman.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

namespace JM.Knockout.Services
{
	using System;
	using System.Globalization;
	using System.IO;
	using System.Web;
	using System.Web.Services;
	using System.Xml.Linq;

	[WebService(Namespace = "http://joem.me/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	public class Controls : IHttpHandler
	{
		private readonly string[] CONTROL_SEPERATORS = new string[] { "," };
		private const string NAMESPACE_SEPERATOR = ".";

		private const string SCRIPT_EXT = ".js";
		private const string TEMPLATE_EXT = ".html";
		private const string STYLE_EXT = ".css";

		private const string PAGES_FOLDER = "/pages/";

		public void ProcessRequest(HttpContext context)
		{
			if ( !IsSameDomain( context ) )
				return;

			var controlParams = GetParameter( "c", context );
			var applicationPrefixName = GetParameter( "app", context );

			string[] controlRequests = controlParams.Split(CONTROL_SEPERATORS, StringSplitOptions.RemoveEmptyEntries);

			XElement response = new XElement("controls");

			for (int i = 0; i < controlRequests.Length; i++)
			{
				string controlRequest = controlRequests[i];
				string path = controlRequest.Replace(NAMESPACE_SEPERATOR, "/");

				if(!String.IsNullOrWhiteSpace(applicationPrefixName))
				{
					path = path.Substring( path.IndexOf( "/" ) );
				}

				XElement control = new XElement("control");
				control.Add(new XAttribute("type", controlRequest));

				// get the javascript
				string mappedPath = context.Request.MapPath(PAGES_FOLDER + path + SCRIPT_EXT);
				if (File.Exists(mappedPath))
				{
					XElement script = new XElement("script");
					script.Value = File.ReadAllText(mappedPath);

					control.Add(script);
				}

				// get the html
				mappedPath = context.Request.MapPath(PAGES_FOLDER + path + TEMPLATE_EXT);
				if (File.Exists(mappedPath))
				{
					XElement template = new XElement("template");
					template.Value = File.ReadAllText(mappedPath);
					control.Add(template);
				}

				// get the css
				mappedPath = context.Request.MapPath(PAGES_FOLDER + path + STYLE_EXT);
				if (File.Exists(mappedPath))
				{
					XElement style = new XElement("style");
					style.Value = File.ReadAllText(mappedPath);
					control.Add(style);
				}

				response.Add(control);
			}

			context.Response.ContentType = "text/xml";
			context.Response.Write(response.ToString());
		}

		public bool IsReusable
		{
			get
			{
				return false;
			}
		}

		private static string GetParameter(string key, HttpContext context)
		{
			string param = context.Request[key];
			if (param != null)
			{
				param = param.Trim();
			}

			return param;
		}

		private static bool IsSameDomain( HttpContext context )
		{
			HttpRequest request = context.Request;
			HttpResponse response = context.Response;

			// Try and prevent request from a different domain
			if ( request.Url != null && request.UrlReferrer != null )
			{
				if ( String.Compare( request.Url.Host, request.UrlReferrer.Host, true, CultureInfo.InvariantCulture ) != 0 )
				{
					response.Write( "Access Denied" );
					return false;
				}
			}

			return true;
		}
	}
}
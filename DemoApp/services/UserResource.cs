namespace DemoApp.services
{
	using System.Collections.Generic;
	using System.ServiceModel;
	using System.ServiceModel.Web;

	public class User
	{
		public string firstName { get; set; }
		public string lastName { get; set; }
		public string occupation { get; set; }
		public List<Employer> employment { get; set; }
	}

	public class Employer
	{
		public string name { get; set; }
		public string title { get; set; }
		public string start { get; set; }
		public string end { get; set; }
	}

	[ServiceContract]
	public class UserResource
	{
		private static User _user = new User
		{
			firstName = "Joe",
			lastName = "McBride",
			occupation = "Software Craftsman",
			employment = new List<Employer>
			{
				new Employer
				{
					name = "McBride Software Solutions, Inc.",
					title = "Owner / President",
					start = "2008",
					end = "Present"
				},
				new Employer
				{
					name = "Veracity Solutions",
					title = "Consultant",
					start = "2008",
					end = "Present"
				},
			}
		};

		[WebGet( UriTemplate = "" )]
		public User Get()
		{
			return _user;
		}

		[WebInvoke( UriTemplate = "", Method = "PUT" )]
		public User Put( User user )
		{
			_user = user;

			return user;
		}
	}
}
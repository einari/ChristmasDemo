using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.Extensions.Logging;

namespace DNXDemo
{
	public class PlayerHub : Hub
	{
		ILogger _logger;
		
		public PlayerHub(ILoggerFactory loggerFactory)
		{
			_logger = loggerFactory.CreateLogger("PlayerHub");
		}
		
		public void SetPosition(float x, float y, float z)
		{
			_logger.LogInformation($"Position : {x}, {y} {z}");
			
			Clients.AllExcept(Context.ConnectionId).setPosition(Context.ConnectionId, x,y,z);
		}
		
		
		public override Task OnConnected()
		{
			Clients.All.connected(Context.ConnectionId);
			return base.OnConnected();
		}
		
		public override Task OnDisconnected(bool stopCalled)
		{
			Clients.All.disconnected(Context.ConnectionId);
			return base.OnDisconnected(stopCalled);
		}
		
	}
}




using Microsoft.AspNet.SignalR;

namespace DNXDemo
{
    
    public class ChatHub : Hub
    {
        
        public void SendMessage(string message)
        {
            Clients.All.messageReceived(message);
        }
    }
    
}
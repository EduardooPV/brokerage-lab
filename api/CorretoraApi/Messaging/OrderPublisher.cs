using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

public class OrderPublisher
{
  private readonly IConnection _connection;
  private const string QueueName = "order.process";

  public OrderPublisher(IConnection connection)
  {
    _connection = connection;
  }

  public async Task PublishAsync(int orderId)
  {
    await using var channel = await _connection.CreateChannelAsync();

    await channel.QueueDeclareAsync(
      queue: QueueName,
      durable: true,
      exclusive: false,
      autoDelete: false
    );

    var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new { orderId }));

    await channel.BasicPublishAsync(
      exchange: string.Empty,
      routingKey: QueueName,
      body: body
    );
  }
}
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.Server.HttpSys;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

public class OrderWorker : BackgroundService
{
  private readonly IConnection _connection;
  private readonly IServiceScopeFactory _scopeFactory;
  private const string QueueName = "order.process";

  public OrderWorker(IConnection connection, IServiceScopeFactory scopeFactory)
  {
    _connection = connection;
    _scopeFactory = scopeFactory;
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    var channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

    await channel.QueueDeclareAsync(
      queue: QueueName,
      durable: true,
      exclusive: false,
      autoDelete: false,
      arguments: new Dictionary<string, object?>
      {
        { "x-dead-letter-exchange", ""},
        { "x-dead-letter-routing-key", "order.process.dlq"}
      },
      cancellationToken: stoppingToken
    );

    await channel.QueueDeclareAsync(
      queue: "order.process.dlq",
      durable: true,
      exclusive: false,
      autoDelete: false,
      cancellationToken: stoppingToken
    );

    await channel.BasicQosAsync(prefetchSize: 0, prefetchCount: 1, global: false, cancellationToken: stoppingToken);

    var consumer = new AsyncEventingBasicConsumer(channel);

    consumer.ReceivedAsync += async (_, ea) =>
    {
      var body = Encoding.UTF8.GetString(ea.Body.ToArray());
      var message = JsonSerializer.Deserialize<OrderMessage>(body, new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true
      });

      if (message is null)
      {
        await channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: false);
        return;
      }

      using var scope = _scopeFactory.CreateScope();
      var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

      var order = await db.Orders.FindAsync(message.OrderId);
      if (order is null)
      {
        await channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: false);
        return;
      }

      try
      {

        order.Status = OrderStatus.Processing;
        await db.SaveChangesAsync();

        // Processing simulation
        await Task.Delay(3000, stoppingToken);

        order.Status = OrderStatus.Executed;
        await db.SaveChangesAsync();

        await channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
      }
      catch (Exception ex)
      {
        Console.WriteLine($"[OrderWorker] Falha ao processar ordem {message.OrderId}: {ex.Message}");

        order.Status = OrderStatus.Failed;
        await db.SaveChangesAsync();

        await channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: false);
      }
    };

    await channel.BasicConsumeAsync(
      queue: QueueName,
      autoAck: false,
      consumer: consumer,
      cancellationToken: stoppingToken
    );

    await Task.Delay(Timeout.Infinite, stoppingToken);
  }
}

record OrderMessage(int OrderId);
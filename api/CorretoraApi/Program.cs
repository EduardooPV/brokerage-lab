using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
  .AddJsonOptions(options => options
  .JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options
  .UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
  .UseSnakeCaseNamingConvention());
builder.Services.AddSingleton<IConnection>(_ =>
{
  var factory = new ConnectionFactory { HostName = "localhost" };
  return factory.CreateConnectionAsync().GetAwaiter().GetResult();
});
builder.Services.AddScoped<OrderPublisher>();
builder.Services.AddHostedService<OrderWorker>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class OrdersController : ControllerBase
{
  private readonly AppDbContext _context;

  public OrdersController(AppDbContext context)
  {
    _context = context;
  }

  /// <summary>
  /// Lista todas as ordens de compra e venda do usuário.
  /// </summary>
  [HttpGet]
  [Produces("application/json")]
  [ProducesResponseType(typeof(IEnumerable<OrderResponse>), StatusCodes.Status200OK)]
  public async Task<IActionResult> GetOrders()
  {
    var orders = await _context.Orders
    .Include(o => o.Asset).ToListAsync();

    var result = orders.Select(o => new OrderResponse
    {
      Id = o.Id,
      Quantity = o.Quantity,
      Type = o.Type.ToString(),
      Status = o.Status.ToString(),
      AssetName = o.Asset.Name
    }).ToList();

    return Ok(result);
  }

  /// <summary>
  ///  Cria uma nova ordem de compra e venda para o usuário.
  /// </summary>
  [HttpPost]
  [Produces("application/json")]
  [ProducesResponseType(typeof(IEnumerable<CreateOrderResponse>), StatusCodes.Status201Created)]
  public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request, [FromHeader(Name = "Idempotency-Key")] Guid idempotencyKey)
  {
    var existingOrder = await _context.Orders.FirstOrDefaultAsync(o => o.TransactionId == idempotencyKey);

    if (existingOrder != null)
    {
      return Ok(new CreateOrderResponse
      {
        Id = existingOrder.Id,
        AccountId = existingOrder.AccountId,
        AssetId = existingOrder.AssetId,
        Quantity = existingOrder.Quantity,
        Type = existingOrder.Type.ToString().ToLower()
      });
    }

    await using var transaction = await _context.Database.BeginTransactionAsync();

    var account = await _context.Accounts.FindAsync(request.AccountId);
    if (account == null)
    {
      return NotFound("Conta não encontrada.");
    }

    var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == request.AssetId);
    if (asset == null)
    {
      return NotFound("Ativo não encontrado.");
    }

    if (account.Balance < request.Quantity * asset.Price)
    {
      return BadRequest("Saldo insuficiente.");
    }

    account.Balance -= request.Quantity * asset.Price;

    var newOrder = new Order
    {
      AccountId = request.AccountId,
      AssetId = request.AssetId,
      Type = Enum.Parse<OrderType>(request.Type, ignoreCase: true),
      Status = OrderStatus.Pending,
      TransactionId = idempotencyKey,
      CreatedAt = DateTime.UtcNow,
      Quantity = request.Quantity
    };

    _context.Orders.Add(newOrder);

    await _context.SaveChangesAsync();

    await transaction.CommitAsync();

    return CreatedAtAction(nameof(GetOrders), new { id = newOrder.Id }, new CreateOrderResponse
    {
      Id = newOrder.Id,
      AccountId = newOrder.AccountId,
      AssetId = newOrder.AssetId,
      Quantity = newOrder.Quantity,
      Type = newOrder.Type.ToString()
    });
  }
}

using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using IDatabase = StackExchange.Redis.IDatabase;

[ApiController]
[Route("[controller]")]
public class AssetsController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IDatabase _redis;
  private const int TtlSeconds = 60;

  public AssetsController(AppDbContext context, IConnectionMultiplexer redis)
  {
    _context = context;
    _redis = redis.GetDatabase();
  }

  [HttpGet("{id}/price")]
  public async Task<IActionResult> GetPrice(int id)
  {
    var cacheKey = $"asset:{id}:price";

    var cached = await _redis.StringGetAsync(cacheKey);
    if (cached.HasValue)
    {
      return Ok(new { price = (decimal)cached, source = "cached" });
    }

    var asset = await _context.Assets.FindAsync(id);
    if (asset is null)
    {
      return NotFound();
    }

    await _redis.StringSetAsync(cacheKey, asset.Price.ToString(), TimeSpan.FromSeconds(TtlSeconds));

    return Ok(new { price = asset.Price, source = "database" });
  }
}
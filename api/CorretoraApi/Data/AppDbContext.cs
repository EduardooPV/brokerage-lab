using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  public DbSet<Account> Accounts { get; set; }
  public DbSet<Order> Orders { get; set; }
  public DbSet<Asset> Assets { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<Order>(e =>
    {
      e.ToTable("orders");
      e.Property(o => o.Type).HasConversion(
          v => v.ToString().ToLower(),
          v => Enum.Parse<OrderType>(v, true)
      );
      e.Property(o => o.Status).HasConversion(
        v => v.ToString().ToLower(),
        v => Enum.Parse<OrderStatus>(v, true)
      );
    });

    modelBuilder.Entity<Account>().ToTable("accounts");
    modelBuilder.Entity<Asset>().ToTable("assets");
  }
}
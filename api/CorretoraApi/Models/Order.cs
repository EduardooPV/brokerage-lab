public class Order
{
    public int Id { get; set; }
    public Account Account { get; set; } = null!;
    public Asset Asset { get; set; } = null!;
    public int AccountId { get; set; }
    public int AssetId { get; set; }
    public int Quantity { get; set; }
    public OrderType Type { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid TransactionId { get; set; }
}
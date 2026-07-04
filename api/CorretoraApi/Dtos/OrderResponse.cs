public class OrderResponse
{
    /// <summary>ID único da ordem.</summary>
    public int Id { get; set; }

    /// <summary>Quantidade de ativos na ordem.</summary>
    public int Quantity { get; set; }

    /// <summary>Tipo da operação: Buy ou Sell.</summary>
    public required string Type { get; set; }

    /// <summary>Status atual: Pending, Processing, Executed, Failed.</summary>
    public required string Status { get; set; }

    /// <summary>Nome do ativo (ticker).</summary>
    public required string AssetName { get; set; }
}

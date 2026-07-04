public class CreateOrderRequest
{
  /// <summary> ID único do cliente. </summary>
  public required int AccountId { get; set; }

  /// <summary>ID único do ativo.</summary>
  public int AssetId { get; set; }

  /// <summary>Quantidade de ativos na ordem.</summary>
  public int Quantity { get; set; }

  /// <summary>Tipo da operação: Buy ou Sell.</summary>
  public required string Type { get; set; }
}
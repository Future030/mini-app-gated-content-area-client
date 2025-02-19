using JetBrains.Annotations;
using Refit;

namespace Future030.MiniApp.GatedContentArea.Client.Services;

public interface IContentService
{
    [Post("/api/content")]
    Task<List<string>?> GetGatedContentAsync([Body] GatedContentRequest request);
}

[UsedImplicitly]
public record GatedContentRequest(string VisitorUP, string OwnerUP, int ChainId, string Area, string Nonce, string Signature);
using Refit;

namespace Future030.MiniApp.GatedContentArea.Client.Services;

public interface IContentService
{
    [Post("/api/content/images")]
    Task<List<string>> GetGatedContentAsync([Body] GatedContentRequest request);
}

public record GatedContentRequest(string VisitorUP, string OwnerUP, string Area, string Nonce, string Signature);
using JetBrains.Annotations;
using Refit;

namespace Future030.MiniApp.GatedContentArea.Client.Services;

public interface IContentService
{
    // 🔹 Fetch list of gated content
    [Get("/api/content/list/{ownerUP}/{area}")]
    Task<ApiResponse<List<ContentItem>>> GetGatedContentAsync(
        string ownerUP,
        string area,
        [Header("X-Visitor-UP")] string visitorUP,
        [Header("X-Nonce")] string nonce,
        [Header("X-Signature")] string signature,
        [Header("X-Chain-Id")] int chainId);


    // 🔹 Fetch actual content (streamed)
    [Get("/api/content/fetch/{ownerUP}/{area}/{fileName}")]
    Task<ApiResponse<Stream>> GetGatedContentStreamAsync(
        string ownerUP,
        string area,
        string fileName,
        [Header("X-Visitor-UP")] string visitorUP,
        [Header("X-Nonce")] string nonce,
        [Header("X-Signature")] string signature,
        [Header("X-Chain-Id")] int chainId);
}

// 📌 ContentItem Model (returned by `/api/content/list/...`)
[UsedImplicitly(ImplicitUseTargetFlags.Members)]
public class ContentItem
{
    public string FileName { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
}
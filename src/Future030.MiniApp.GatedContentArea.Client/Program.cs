using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Options;
using Future030.MiniApp.GatedContentArea.Client;
using Future030.MiniApp.GatedContentArea.Client.Configuration;
using Future030.MiniApp.GatedContentArea.Client.Services;
using Refit;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Logging.SetMinimumLevel(LogLevel.Debug); // Set the minimum log level
builder.Logging.AddFilter("System", LogLevel.Warning); // Reduce verbosity of system logs
builder.Logging.AddFilter("Microsoft", LogLevel.Warning); // Reduce verbosity of Microsoft logs

builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Bind BackendApi section to strongly typed options
builder.Services.Configure<BackendApiOptions>(builder.Configuration.GetSection("BackendApi"));

builder.Services
    .AddRefitClient<IContentService>()
    .ConfigureHttpClient((sp, client) =>
    {
        var options = sp.GetRequiredService<IOptions<BackendApiOptions>>().Value;

        if (string.IsNullOrEmpty(options.BaseUrl))
        {
            throw new InvalidOperationException("Backend API URL is not configured in appsettings.json.");
        }

        client.BaseAddress = new Uri(options.BaseUrl);
    });

var host = builder.Build();

// Retrieve the Backend API URL from DI and log it after startup
var backendApiOptions = host.Services.GetRequiredService<IOptions<BackendApiOptions>>().Value;
var logger = host.Services.GetRequiredService<ILogger<Program>>();

logger.LogInformation("🚀 FUTURE030 Gated Content Area - Mini App - Backend API URL: {BaseUrl}", backendApiOptions.BaseUrl);

await host.RunAsync();
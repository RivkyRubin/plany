using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PlannyCore;
using PlannyCore.Dal;
using PlannyCore.Data;
using PlannyCore.Data.Entities.Identity;
using PlannyCore.Filters;
using PlannyCore.Services;
using Serilog;
using Serilog.Sinks.Elasticsearch;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using static PlannyCore.Filters.ValidatorActionFilter;
using Newtonsoft.Json;
//using Microsoft.Extensions.Logging.Log4Net.AspNetCore;
//ConfigureLogging();

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);
//var x = new ConfigurationBuilder();
//x.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

builder.Configuration.AddEnvironmentVariables(prefix: $"Plany_{ builder.Environment.EnvironmentName}_");


builder.Services.AddControllers(config =>
{
    config.Filters.Add(new CustomExceptionFilter());
    config.Filters.Add(new ValidatorActionFilter());
    config.Filters.Add(new AsyncActionFilterExample());
});//.AddNewtonsoftJson();
builder.Services.AddCors(options => options.AddPolicy("Cors", builder =>
{
    builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
}));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
builder.Services.AddScoped(typeof(IEntityBaseRepository<,>), typeof(EntityBaseRepository<,>));
builder.Services.AddScoped(typeof(IBaseCRUDService<,>), typeof(BaseCRUDService<,>));
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddTransient<ITokenService, TokenService>();
builder.Services.AddTransient<IAccountService, AccountService>();
builder.Services.AddTransient<IAdminService, AdminService>();
builder.Services.AddTransient<IPasswordHasher, PasswordHasher>();
builder.Services.AddTransient<IAdminRepository, AdminRepository>();
builder.Services.AddTransient<IEventRepository, EventRepository>();
builder.Services.AddTransient<IEventTypeRepository, EventTypeRepository>();
builder.Services.AddTransient<IEventGroupRepository, EventGroupRepository>();
builder.Services.AddTransient<ISystemParameterRepository, SystemParameterRepository>();
builder.Services.AddTransient<ISystemParameterService, SystemParameterService>();
builder.Services.AddTransient<IEventService, EventService>();
builder.Services.AddTransient<IEventGroupService, EventGroupService>();
builder.Services.AddTransient<IEventTypeService, EventTypeService>();
Console.WriteLine("cs: " + builder.Configuration["ConnectionStrings:DefaultConnection"]);
Console.WriteLine("key: " + builder.Configuration["Jwt:Key"]);
Console.WriteLine("env:" + Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"));
builder.Services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                        ClockSkew = TimeSpan.Zero // remove delay of token when expire
                    };
                });
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder("Bearer").RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddDbContext<ApplicationDbContext>(options =>
      options.UseSqlServer(
          builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(
        options =>
        {
            options.SignIn.RequireConfirmedAccount = true;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.User.RequireUniqueEmail = true;
            options.User.AllowedUserNameCharacters = String.Empty;// "àáâãäåæçèéëìîðñòôö÷øùúêíïóõabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
        }
        )
    .AddEntityFrameworkStores<ApplicationDbContext>()
       .AddDefaultTokenProviders();


builder.Services.AddAutoMapper(typeof(Program));
//builder.Services.AddAuthorization();
if (builder.Environment.EnvironmentName == "Development")
{
  
    builder.Host.UseSerilog((ctx, lc) => lc
           .WriteTo.Console()
            .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(ctx.Configuration["ElasticConfiguration:Uri"]))
            {
                IndexFormat = $"{ctx.Configuration["ApplicationName"]}-logs-{ctx.HostingEnvironment.EnvironmentName?.ToLower().Replace('.', '=')}-{DateTime.UtcNow:yyyy-MM}",
                AutoRegisterTemplate = true,
                NumberOfShards = 2,
                NumberOfReplicas = 1
            }
            )
            .Enrich.WithProperty("Environment", ctx.HostingEnvironment.EnvironmentName)
           .ReadFrom.Configuration(ctx.Configuration));
}
else
    builder.Logging.AddLog4Net();

var app = builder.Build();

//if we want to migrate database on startup
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;

//    var context = services.GetRequiredService<ApplicationDbContext>();
//    context.Database.Migrate();
//}


app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});
app.UseCors("Cors");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();


    app.UseSerilogRequestLogging();
}
else
{
    app.UseDeveloperExceptionPage();
    app.UseHsts();
    app.UseHttpsRedirection();
}
Console.WriteLine("env1:" + app.Environment.EnvironmentName);



app.MapControllers();


app.UseAuthentication();
app.UseAuthorization();
app.Run();



//static void ConfigureLogging()
//{
//    var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
//    var configuration = new ConfigurationBuilder()
//        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
//        .AddJsonFile(
//            $"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json",
//            optional: true)
//        .Build();

//    Log.Logger = new LoggerConfiguration()
//        .Enrich.FromLogContext()
//        .Enrich.WithMachineName()
//        .WriteTo.Debug()
//        .WriteTo.Console()
//        .WriteTo.Elasticsearch(ConfigureElasticSink(configuration, environment))
//        .Enrich.WithProperty("Environment", environment)
//        .ReadFrom.Configuration(configuration)
//        .CreateLogger();
//}

// static ElasticsearchSinkOptions ConfigureElasticSink(IConfigurationRoot configuration, string environment)
//{
//    return new ElasticsearchSinkOptions(new Uri(configuration["ElasticConfiguration:Uri"]))
//    {
//        AutoRegisterTemplate = true,
//        IndexFormat = $"{Assembly.GetExecutingAssembly().GetName().Name.ToLower().Replace(".", "-")}-{environment?.ToLower().Replace(".", "-")}-{DateTime.UtcNow:yyyy-MM}"
//    };
//}

//static void CreateHost(string[] args)
//{
//    try
//    {
//        CreateHostBuilder(args).Build().Run();
//    }
//    catch (System.Exception ex)
//    {
//        Log.Fatal($"Failed to start {Assembly.GetExecutingAssembly().GetName().Name}", ex);
//        throw;
//    }
//}

//static IHostBuilder CreateHostBuilder(string[] args) =>
//    Host.CreateDefaultBuilder(args)
//        .ConfigureWebHostDefaults(webBuilder =>
//        {
//            webBuilder.UseStartup<Startup>();
//        })
//        .ConfigureAppConfiguration(configuration =>
//        {
//            configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
//            configuration.AddJsonFile(
//                $"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json",
//                optional: true);
//        })
//        .UseSerilog();
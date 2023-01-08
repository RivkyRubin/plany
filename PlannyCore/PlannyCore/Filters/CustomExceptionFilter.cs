using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using PlannyCore.DomainModel.Exceptions;
using PlannyCore.Models;
using System.ComponentModel.DataAnnotations;
using System.Net;
using PlannyCore.Controllers;
using log4net;

namespace PlannyCore.Filters
{
    public class CustomExceptionFilter : ExceptionFilterAttribute
    {
        private string message = String.Empty;
        private HttpStatusCode status = HttpStatusCode.InternalServerError;

        /// <summary>
        /// On Exception
        /// </summary>
        /// <param name="context"></param>
        public override void OnException(ExceptionContext context)
        {
            var logger = (ILogger<CustomExceptionFilter>)context.HttpContext.RequestServices.
            GetService(typeof(ILogger<CustomExceptionFilter>));

            var exceptionType = context.Exception.GetType();
            var statusCode = context.HttpContext.Response.StatusCode;
            if (exceptionType == typeof(UnauthorizedAccessException))
            {
                message = "Unauthorized Access";
                status = HttpStatusCode.Unauthorized;
            }
            else if (exceptionType == typeof(NotImplementedException))
            {
                message = "A server error occurred.";
                status = HttpStatusCode.NotImplemented;
            }
            else if (exceptionType == typeof(FailException) || exceptionType == typeof(ValidationException) || exceptionType == typeof(ArgumentException))
            {
                message = context.Exception.Message.ToString();
                status = HttpStatusCode.BadRequest;
            }
            else
            {
                message = context.Exception.Message;
                status = HttpStatusCode.InternalServerError;
            }
            logger.LogError($"OnException. message: {message}, status: {status}");
            context.HttpContext.Response.StatusCode = (int)status;

            // Return Object result
            context.Result = new ObjectResult(ApiResponse<string>.ErrorResult(message: message, statusCode: status));

        }
    }
}

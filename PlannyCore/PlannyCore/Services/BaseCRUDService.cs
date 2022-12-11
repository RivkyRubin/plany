using AutoMapper;
using PlannyCore.Dal;
using PlannyCore.Data.Entities;
using PlannyCore.DomainModel;
using PlannyCore.DomainModel.Exceptions;
using PlannyCore.Models;
using System.ComponentModel.DataAnnotations;
using System.Net;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace PlannyCore.Services
{
    public interface IBaseCRUDService<T, TModel> where T : class, IEntityBase, new()
    {
        Task<ApiResponse<List<TModel>>> GetAllAsync();
        Task<ApiResponse<TModel>> GetByIdAsync(int id);
        Task<ApiResponse<int?>> AddOrUpdateAsync(TModel model);
        Task<ApiResponse<int?>> AddAsync(TModel model);
        Task<ApiResponse<int?>> UpdateAsync(TModel model);
        Task<ApiResponse<bool>> DeleteAsync(int id);
    }
    public class BaseCRUDService<T, TModel> : IBaseCRUDService<T, TModel> where T : class, IEntityBase, new()
    {
        private readonly IEntityBaseRepository<T, int> _dbRepository;
        private readonly IMapper _mapper;

        public BaseCRUDService(IEntityBaseRepository<T, int> dbRepository, IMapper mapper)
        {
            this._dbRepository = dbRepository;
            this._mapper = mapper;
        }

        public async Task<ApiResponse<List<TModel>>> GetAllAsync()
        {
            try
            {
                var result = await _dbRepository.GetAllAsync();
                var model = _mapper.Map<List<T>, List<TModel>>(result);
                return ApiResponse<List<TModel>>.SuccessResult(model);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<List<TModel>>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<List<TModel>>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<List<TModel>>.ErrorResult(message: ex.Message);
            }
        }

        public async Task<ApiResponse<TModel>> GetByIdAsync(int id)
        {
            try
            {
                var result = await _dbRepository.GetByIdAsync(id);
                var model = _mapper.Map<T, TModel>(result);

                return ApiResponse<TModel>.SuccessResult(model);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<TModel>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<TModel>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<TModel>.ErrorResult(message: ex.Message);
            }
        }

        public async Task<ApiResponse<int?>> AddOrUpdateAsync(TModel model)
        {
            try
            {
                var result = _mapper.Map<TModel, T>(model);
                result.UpdatedDate = DateTime.Now;
                if (result.Id > 0)
                {
                    await _dbRepository.UpdateAsync(result);
                }
                else
                {
                    result.CreatedDate = DateTime.Now;
                    result = await _dbRepository.AddAsync(result);

                }

                var testResult = await Task.FromResult(result.Id);
                await AfterAdd(result);
                return ApiResponse<int?>.SuccessResult(testResult);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<int?>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<int?>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<int?>.ErrorResult(message: ex.Message);
            }

        }

        public async Task<ApiResponse<int?>> AddAsync(TModel model)
        {
            try
            {
                var result = _mapper.Map<TModel, T>(model);
                result.UpdatedDate = DateTime.Now;
                result.CreatedDate = DateTime.Now;
                result = await _dbRepository.AddAsync(result);
                var testResult = await Task.FromResult(result.Id);
                await AfterAdd(result);
                return ApiResponse<int?>.SuccessResult(testResult);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<int?>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<int?>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<int?>.ErrorResult(message: ex.Message);
            }

        }

        public async Task<ApiResponse<int?>> UpdateAsync(TModel model)
        {
            try
            {
                var result = _mapper.Map<TModel, T>(model);
                result.UpdatedDate = DateTime.Now;
                await _dbRepository.UpdateAsync(result);
                var testResult = await Task.FromResult(result.Id);
                //await AfterApdate(result);
                return ApiResponse<int?>.SuccessResult(testResult);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<int?>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<int?>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<int?>.ErrorResult(message: ex.Message);
            }

        }

        /// <summary>
        /// Delete Async
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            try
            {
                var result = await _dbRepository.DeleteAsync(id);
                return ApiResponse<bool>.SuccessResult(result);
            }
            catch (Exception ex) when (ex is FailException || ex is ValidationException || ex is ArgumentException)
            {
                return ApiResponse<bool>.ErrorResult(message: ex.Message, statusCode: HttpStatusCode.BadRequest);
            }
            catch (Exception ex) when (ex is ErrorException)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<bool>.ErrorResult(message: ex.Message);
            }
            catch (Exception ex)
            {
                //LoggingManager.Error(ex.ToString());
                return ApiResponse<bool>.ErrorResult(message: ex.Message);
            }
        }

        public virtual async Task AfterAdd(T entity)
        {

        }
    }
}

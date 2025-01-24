using System;
using System.Linq.Expressions;

namespace Core.Interfaces;

public interface ISpecification<T>
{
    /**
     * Gets the criteria expression to filter the entities.
     * 
     * @returns An expression representing the filter criteria.
     */
    Expression<Func<T, bool>>? Criteria { get; } // x => x.Brand == brand

    /**
     * Gets the expression to order the entities in ascending order.
     * 
     * @returns An expression representing the order by criteria.
     */
    Expression<Func<T, object>>? OrderBy { get; }

    /**
     * Gets the expression to order the entities in descending order.
     * 
     * @returns An expression representing the order by descending criteria.
     */
    Expression<Func<T, object>>? OrderByDescending { get; }

    /**
     * Gets a value indicating whether the query should return distinct results.
     * 
     * @returns True if the query should return distinct results, otherwise false.
     */
    bool IsDistinct { get; }

    /**
     * Gets the number of entities to take.
     * 
     * @returns The number of entities to take.
     */
    int Take { get; }

    /**
     * Gets the number of entities to skip.
     * 
     * @returns The number of entities to skip.
     */
    int Skip { get; }

    /**
     * Gets a value indicating whether paging is enabled.
     * 
     * @returns True if paging is enabled, otherwise false.
     */
    bool IsPagingEnabled { get; }

    /**
     * Applies the criteria to the given query.
     * 
     * @param query - The query to apply the criteria to.
     * @returns The query with the criteria applied.
     */
    IQueryable<T> ApplyCriteria(IQueryable<T> query);
}

public interface ISpecification<T, TResult> : ISpecification<T> // for brands and types 
{
    /**
     * Gets the expression to select specific fields from the entities.
     * 
     * @returns An expression representing the select criteria.
     */
    Expression<Func<T, TResult>>? Select { get; }
}
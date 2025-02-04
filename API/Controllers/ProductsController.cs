using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProductsController(IUnitOfWork unit) : BaseApiController
{
    /**
     * Retrieves a list of products based on the provided specification parameters.
     * 
     * @param specParams - The parameters to filter and sort the products.
     * @returns A paginated list of products.
     */
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts([FromQuery]ProductSpecParams specParams)
    {
        var spec = new ProductSpecification(specParams);
        return await CreatePagedResult(unit.Repository<Product>(), spec, specParams.PageIndex, specParams.PageSize);
    }

    /**
     * Retrieves a single product by its ID.
     * 
     * @param id - The ID of the product to retrieve.
     * @returns The product if found, otherwise a NotFound result.
     */
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if(product == null) return NotFound();

        return product;
    }

    /**
     * Creates a new product.
     * 
     * @param product - The product to create.
     * @returns The created product if successful, otherwise a BadRequest result.
     */
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        unit.Repository<Product>().Add(product);

        if(await unit.Complete())
            return CreatedAtAction("GetProduct", new {id = product.Id}, product);

        return BadRequest("Problem creating product!");
    }

    /**
     * Updates an existing product.
     * 
     * @param id - The ID of the product to update.
     * @param product - The updated product data.
     * @returns NoContent if successful, otherwise a BadRequest result.
     */
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if(product.Id != id || !ProductExists(id))
            return BadRequest("Cannot update this product!");

        unit.Repository<Product>().Update(product);

        if(await unit.Complete())
            return NoContent();

        return BadRequest("Problem updating the product!");
    }

    /**
     * Deletes a product by its ID.
     * 
     * @param id - The ID of the product to delete.
     * @returns NoContent if successful, otherwise a BadRequest result.
     */
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if(product == null) return NotFound();

        unit.Repository<Product>().Remove(product);
        if(await unit.Complete())
            return NoContent();

        return BadRequest("Problem deleting the product!");
    }

    /**
     * Retrieves the list of product brands.
     * 
     * @returns A list of product brands.
     */
    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecification();

        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }

    /**
     * Retrieves the list of product types.
     * 
     * @returns A list of product types.
     */
    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();

        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }

    /**
     * Checks if a product exists by its ID.
     * 
     * @param id - The ID of the product to check.
     * @returns True if the product exists, otherwise false.
     */
    private bool ProductExists(int id)
    {
        return unit.Repository<Product>().Exists(id);
    }
}
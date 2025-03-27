using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ecommerce.Application.ServicesInterfaces;
using Ecommerce.Core.Entities;
using Ecommerce.Core.Repositories;
using Ecommerce.Infrastructure.Repositories;

namespace Ecommerce.Infrastructure.Services
{
    public class CartService(ICartRepository cartRepository) : ICartService
    {
        public async Task<IEnumerable<CartItem>> GetAll()
        {
            var cartList = await cartRepository.GetAll();
            return cartList;
        }

        public async Task<IList<CartItem>> GetCartByCustomerId(int customerId)
        {
            var cartLists = await cartRepository.GetCartByCustomerId(customerId);
            return cartLists;
        }

        public async Task<bool> RemoveAllCartItemOfCustomer(int customerId)
        {
            var result = await cartRepository.RemoveAllItemInCartOfCustomer(customerId);
            return result;
        }

        public async Task<CartItem?> FindById(int id)
        {
            var cartItem = await cartRepository.FindByCondition(ct => ct.ID == id, new[] { "Product", "Size" });
            return cartItem;
        }

        public async Task<CartItem> Create(CartItem entity)
        {
            await cartRepository.Add(entity);
            return entity;
        }

        public async Task<CartItem> Edit(CartItem entity, int id)
        {
            await cartRepository.Update(entity, id);
            return entity;
        }

        public async Task<bool> Delete(int id)
        {
            var result = await cartRepository.Delete(id);
            return result;
        }
    }
}
